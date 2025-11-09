document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.event-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    let isAnimating = false;
    let transitionIndex = 0;
    
    // Different transition effects
    const transitions = [
        'transition-slide',
        'transition-zoom', 
        'transition-flip',
        'transition-bounce',
        'transition-fold',
        'transition-glitch',
        'transition-swirl',
        'transition-blur'
    ];
    
    function getNextTransition() {
        const transition = transitions[transitionIndex];
        transitionIndex = (transitionIndex + 1) % transitions.length;
        return transition;
    }
    
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        const transitionEffect = getNextTransition();
        
        // Remove all active classes and transition classes
        slides.forEach(slide => {
            slide.classList.remove('active');
            transitions.forEach(trans => slide.classList.remove(trans));
        });
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add new transition effect
        slides[index].classList.add(transitionEffect);
        
        // Show new slide
        setTimeout(() => {
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
            
            // Reset animation flag
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }, 50);
    }
    
    // Next button
    document.querySelector('.next').addEventListener('click', function() {
        if (isAnimating) return;
        let nextSlide = (currentSlide + 1) % totalSlides;
        showSlide(nextSlide);
    });
    
    // Previous button
    document.querySelector('.prev').addEventListener('click', function() {
        if (isAnimating) return;
        let prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevSlide);
    });
    
    // Dot clicks
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (isAnimating || index === currentSlide) return;
            showSlide(index);
        });
    });
    
    // Show first slide initially
    showSlide(0);
});