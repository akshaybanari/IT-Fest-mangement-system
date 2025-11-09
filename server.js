const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from current directory
app.use(express.static(__dirname));

// MongoDB Atlas connection - USING YOUR CREDENTIALS
const uri = "add your data base here ";

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db('itfest'); // Using 'itfest' database
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('📊 Database: itfest');
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    if (!collectionNames.includes('registrations')) {
      await db.createCollection('registrations');
      console.log('📝 Created registrations collection');
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

// Initialize connection
connectToMongoDB();

// Routes - Serve HTML files with proper error handling
app.get('/events.html', (req, res) => {
  const filePath = path.join(__dirname, 'events.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Events page not found. Make sure events.html is in the project root.');
  }
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // If index.html doesn't exist, redirect to events.html
    res.redirect('/events.html');
  }
});

app.get('/about.html', (req, res) => {
  const filePath = path.join(__dirname, 'about.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('About page not found.');
  }
});

// Handle registration
app.post('/register', async (req, res) => {
  try {
    // Check if database is connected
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database not connected. Please try again.' 
      });
    }

    const { eventId, eventName, name, email, phone, college, department, year, section } = req.body;
    
    console.log('📝 Registration attempt:', { eventId, eventName, email });

    // Check if email already registered for this event
    const existingRegistration = await db.collection('registrations').findOne({ 
      email: email, 
      eventId: eventId 
    });
    
    if (existingRegistration) {
      return res.status(400).json({ 
        success: false, 
        message: `You are already registered for ${eventName}!` 
      });
    }

    // Create new registration
    const newRegistration = {
      eventId,
      eventName,
      name,
      email,
      phone,
      college,
      department,
      year,
      section,
      registrationDate: new Date()
    };

    // Insert into database
    const result = await db.collection('registrations').insertOne(newRegistration);
    
    console.log('✅ Registration successful for:', email);
    
    res.json({ 
      success: true, 
      message: `Successfully registered for ${eventName}! We'll contact you soon.`, 
      registrationId: result.insertedId 
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
});

// Get registrations by email - FIXED VERSION
app.get('/registrations', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const email = req.query.email;
    
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    console.log('🔍 Searching for registrations with email:', email);
    
    // EXACT email match
    const registrations = await db.collection('registrations')
      .find({ 
        email: { 
          $eq: email 
        } 
      })
      .sort({ registrationDate: -1 })
      .toArray();

    console.log('📊 Found registrations:', registrations.length);
    console.log('📧 For email:', email);
    
    res.json(registrations);
    
  } catch (error) {
    console.error('❌ Error fetching registrations by email:', error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

// Get ALL registrations (for admin)
app.get('/registrations-all', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        
        const registrations = await db.collection('registrations')
            .find()
            .sort({ registrationDate: -1 })
            .toArray();
        
        res.json(registrations);
        
    } catch (error) {
        console.error('Error fetching all registrations:', error);
        res.status(500).json({ message: 'Error fetching registrations' });
    }
});


// Get registrations by event
app.get('/registrations/:eventId', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const registrations = await db.collection('registrations')
      .find({ eventId: req.params.eventId })
      .sort({ registrationDate: -1 })
      .toArray();
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (db) {
      // Test the connection
      await db.command({ ping: 1 });
      res.json({ 
        status: 'ok', 
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({ 
        status: 'error', 
        database: 'disconnected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.json({ 
      status: 'error', 
      database: 'connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Get registration statistics
app.get('/stats', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const registrations = await db.collection('registrations').find().toArray();
    const stats = {
      total: registrations.length,
      byEvent: {}
    };
    
    registrations.forEach(reg => {
      stats.byEvent[reg.eventName] = (stats.byEvent[reg.eventName] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// ===== DEBUG ROUTE =====
// Debug route - Check all registrations (remove this after testing)
app.get('/debug-all-registrations', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: 'Database not connected' });
    }
    
    const allRegistrations = await db.collection('registrations')
      .find({})
      .sort({ registrationDate: -1 })
      .toArray();
    
    console.log('🔍 ALL REGISTRATIONS IN DATABASE:');
    allRegistrations.forEach(reg => {
      console.log(`📧 ${reg.email} - ${reg.eventName} - ${reg.name}`);
    });
    
    res.json({
      total: allRegistrations.length,
      registrations: allRegistrations
    });
    
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

// ===== ONLY ONE app.listen() =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📅 Events page: http://localhost:${PORT}/events.html`);
  console.log(`🌐 Connecting to MongoDB Atlas...`);
  
  // Check if events.html exists
  const eventsPath = path.join(__dirname, 'events.html');
  if (fs.existsSync(eventsPath)) {
    console.log('✅ events.html found');
  } else {
    console.log('❌ events.html not found in project root');
  }
});