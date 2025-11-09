// Chrome responsive fix
document.addEventListener('DOMContentLoaded', function() {
    // Force reflow on critical elements
    const forceReflow = function() {
        document.body.style.zoom = '1';
        document.documentElement.style.overflowX = 'hidden';
    };
    
    // Initial fix
    forceReflow();
    
    // Fix on window resize
    window.addEventListener('resize', forceReflow);
    
    // Fix after images load
    window.addEventListener('load', forceReflow);
});

// Prevent zoom issues on mobile
document.addEventListener('touchstart', function() {}, {passive: true});