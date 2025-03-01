document.addEventListener('DOMContentLoaded', function() {
    // Function to adjust number of dots based on screen size
    function adjustCarouselDots() {
        // Get the carousel dots container
        const dotsContainer = document.getElementById('carousel-dots');
        
        // If the dots container exists and we can find the carousel items
        if (dotsContainer) {
            // Add more dots for mobile view
            if (window.innerWidth <= 768) {
                // Get all carousel items
                const items = document.querySelectorAll('#carousel-track > div');
                
                // Ensure visible dots for all items on mobile
                if (items.length > dotsContainer.children.length) {
                    // Create additional dots if needed
                    for (let i = dotsContainer.children.length; i < items.length; i++) {
                        const dot = document.createElement('button');
                        dot.classList.add('carousel-dot', 'w-3', 'h-3', 'rounded-full', 'bg-[var(--border-color)]');
                        dot.setAttribute('aria-label', `Slide ${i+1}`);
                        dot.onclick = function() {
                            goToSlide(i);
                        };
                        dotsContainer.appendChild(dot);
                    }
                }
            }
        }
    }
    
    // Run on load
    adjustCarouselDots();
    
    // Run when window is resized
    window.addEventListener('resize', adjustCarouselDots);
    
    // Helper function to navigate to specific slide
    function goToSlide(index) {
        const track = document.getElementById('carousel-track');
        if (track) {
            // Calculate the translation based on slide width and index
            const slideWidth = track.firstElementChild.offsetWidth;
            const gap = 24; // Equivalent to gap-6 in Tailwind (1.5rem = 24px)
            track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
            
            // Update active dot
            updateActiveDot(index);
        }
    }
    
    // Helper function to update active dot
    function updateActiveDot(index) {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('bg-[var(--accent-color)]');
                dot.classList.remove('bg-[var(--border-color)]');
            } else {
                dot.classList.add('bg-[var(--border-color)]');
                dot.classList.remove('bg-[var(--accent-color)]');
            }
        });
    }
}); 