document.addEventListener('DOMContentLoaded', function() {
    const backgroundUpload = document.getElementById('backgroundUpload');
    const resetBackground = document.getElementById('resetBackground');
    const aboutBackground = document.getElementById('aboutBackground');
    const defaultBackground = '../images/solo-leveling-background.gif';

    // Load saved background from localStorage
    const savedBackground = localStorage.getItem('aboutBackground');
    if (savedBackground) {
        aboutBackground.style.backgroundImage = `url(${savedBackground})`;
    }

    // Handle background upload
    backgroundUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                
                // Set the background
                aboutBackground.style.backgroundImage = `url(${imageUrl})`;
                
                // Save to localStorage
                localStorage.setItem('aboutBackground', imageUrl);
                
                // Show success message
                showNotification('Background image updated successfully!');
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Handle reset background
    resetBackground.addEventListener('click', function() {
        aboutBackground.style.backgroundImage = `url(${defaultBackground})`;
        localStorage.removeItem('aboutBackground');
        showNotification('Background reset to default!');
    });

    // Notification function
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.upload-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'upload-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});