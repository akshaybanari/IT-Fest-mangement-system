// Registration functions - COMPLETELY NEW VERSION
function openRegistrationForm(eventName, eventId) {
    console.log('Opening form for:', eventName, eventId);
    
    // Close any existing forms first
    closeRegistrationForm();
    
    // Create a fresh modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'registration-overlay';
    overlay.id = 'registration-overlay';
    
    // Create the form container
    const formHTML = `
        <div class="registration-form-container">
            <div class="registration-form">
                <h3>Register for <span class="event-name">${eventName}</span></h3>
                <form class="register-form" onsubmit="handleRegistration(event)">
                    <input type="hidden" name="eventId" value="${eventId}">
                    
                    <div class="form-group">
                        <input type="text" name="name" class="form-input" placeholder="Full Name" required>
                    </div>
                    
                    <div class="form-group">
                        <input type="email" name="email" class="form-input" placeholder="Email Address" required>
                    </div>
                    
                    <div class="form-group">
                        <input type="tel" name="phone" class="form-input" placeholder="Phone Number" required>
                    </div>
                    
                    <div class="form-group">
                        <input type="text" name="college" class="form-input" placeholder="College Name" required>
                    </div>
                    
                    <div class="form-group">
                        <input type="text" name="department" class="form-input" placeholder="Department" required>
                    </div>
                    
                    <div class="form-group">
                        <select name="year" class="form-input" required>
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <input type="text" name="section" class="form-input" placeholder="Section" required>
                    </div>
                    
                    <div class="registration-message"></div>
                    
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn" onclick="closeRegistrationForm()">Cancel</button>
                        <button type="submit" class="submit-btn">Register Now</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    overlay.innerHTML = formHTML;
    document.body.appendChild(overlay);
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = overlay.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeRegistrationForm() {
    console.log('Closing registration form');
    const overlay = document.getElementById('registration-overlay');
    if (overlay) {
        overlay.remove();
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    console.log('Form submission started');
    
    const form = event.target;
    const formData = new FormData(form);
    const messageDiv = form.querySelector('.registration-message');
    const submitBtn = form.querySelector('.submit-btn');
    
    const data = {
        eventId: formData.get('eventId'),
        eventName: form.closest('.registration-form-container').querySelector('.event-name').textContent,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        college: formData.get('college'),
        department: formData.get('department'),
        year: formData.get('year'),
        section: formData.get('section')
    };

    console.log('Submitting data:', data);

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        messageDiv.style.display = 'block';
        messageDiv.style.marginTop = '15px';
        
        if (result.success) {
    // Redirect to confirmation page with registration details
    const confirmationURL = new URL('confirmation.html', window.location.origin);
    confirmationURL.searchParams.set('id', result.registrationId);
    confirmationURL.searchParams.set('event', data.eventName);
    confirmationURL.searchParams.set('name', data.name);
    confirmationURL.searchParams.set('email', data.email);
    confirmationURL.searchParams.set('college', data.college);
    confirmationURL.searchParams.set('date', new Date().toISOString());
    
    window.location.href = confirmationURL.toString();
}else {
            messageDiv.innerHTML = `<div class="message error">${result.message}</div>`;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register Now';
        }
        
    } catch (error) {
        console.error('Error:', error);
        messageDiv.style.display = 'block';
        messageDiv.style.marginTop = '15px';
        messageDiv.innerHTML = `<div class="message error">Network error. Please try again.</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Now';
    }
}

// New CSS styles - COMPLETELY SEPARATE from existing styles
const registrationStyles = `
    .registration-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
    
    .registration-form-container {
        background: #1a1a1a;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 2px solid #007bff;
        color: white;
    }
    
    .registration-form h3 {
        margin-bottom: 20px;
        color: #fff;
        text-align: center;
        font-size: 24px;
        border-bottom: 2px solid #007bff;
        padding-bottom: 10px;
        font-weight: bold;
    }
    
    .message {
        padding: 12px;
        margin: 15px 0;
        border-radius: 8px;
        font-weight: bold;
        text-align: center;
        font-size: 14px;
    }
    
    .message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #444;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: #2d2d2d;
        color: white;
        box-sizing: border-box;
        font-family: inherit;
    }
    
    .form-input:focus {
        border-color: #007bff;
        outline: none;
        background: #333;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
    }
    
    .form-input::placeholder {
        color: #888;
    }
    
    select.form-input {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23888' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
        background-repeat: no-repeat;
        background-position: right 15px center;
        background-size: 12px;
    }
    
    .submit-btn, .cancel-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        margin: 5px;
        transition: all 0.3s ease;
        font-weight: bold;
        flex: 1;
        font-family: inherit;
    }
    
    .submit-btn {
        background: #007bff;
        color: white;
    }
    
    .submit-btn:hover {
        background: #0056b3;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
    }
    
    .submit-btn:disabled {
        background: #6c757d;
        transform: none;
        box-shadow: none;
        cursor: not-allowed;
    }
    
    .cancel-btn {
        background: #6c757d;
        color: white;
    }
    
    .cancel-btn:hover {
        background: #545b62;
        transform: translateY(-2px);
    }
    
    .form-buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    .registration-form-container::-webkit-scrollbar {
        width: 8px;
    }
    
    .registration-form-container::-webkit-scrollbar-track {
        background: #2d2d2d;
        border-radius: 4px;
    }
    
    .registration-form-container::-webkit-scrollbar-thumb {
        background: #007bff;
        border-radius: 4px;
    }
`;

// Inject styles
if (!document.querySelector('#registration-styles')) {
    const style = document.createElement('style');
    style.id = 'registration-styles';
    style.textContent = registrationStyles;
    document.head.appendChild(style);
}

// Simple event listener for Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRegistrationForm();
    }
});