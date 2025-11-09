// Particle animation for button
document.addEventListener('mousemove', (e) => {
    const button = document.querySelector('.arise-btn');
    const particles = document.querySelector('.shadow-particles');
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    particles.style.setProperty('--x', `${x}px`);
    particles.style.setProperty('--y', `${y}px`);
});

// Enter events page
function enterEvents() {
    // Add transition effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        window.location.href = 'events.html';
    }, 500);
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        enterEvents();
    }
});