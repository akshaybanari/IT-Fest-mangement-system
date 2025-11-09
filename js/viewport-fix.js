// Emergency viewport fix for Chrome
function fixViewport() {
    // Reset viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Force body dimensions
    document.body.style.width = '100vw';
    document.body.style.overflowX = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Force html dimensions
    document.documentElement.style.width = '100%';
    document.documentElement.style.overflowX = 'hidden';
}

// Run on load and ready
document.addEventListener('DOMContentLoaded', fixViewport);
window.addEventListener('load', fixViewport);
window.addEventListener('resize', fixViewport);

// Also fix any potential zoom issues
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
}, { passive: false });