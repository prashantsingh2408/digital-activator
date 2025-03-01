let currentSlide = 0;
const slidesToShow = 3; // Number of cards to show at once
let carouselTrack;
let cards;
let dots;
let autoSlideInterval;

function initializeCarousel() {
    carouselTrack = document.getElementById('carousel-track');
    cards = carouselTrack.children;
    const dotsContainer = document.getElementById('carousel-dots');
    
    // Calculate number of dot indicators needed
    const numberOfDots = Math.ceil(cards.length / slidesToShow);
    
    // Create dot indicators
    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full transition-colors duration-300 ${i === 0 ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'}`;
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
    
    dots = dotsContainer.children;
    
    // Set initial state
    updateCarousel();

    // Start auto-sliding
    startAutoSlide();

    // Pause auto-sliding on hover
    carouselTrack.addEventListener('mouseenter', stopAutoSlide);
    carouselTrack.addEventListener('mouseleave', startAutoSlide);
}

function startAutoSlide() {
    stopAutoSlide(); // Clear any existing interval
    autoSlideInterval = setInterval(() => {
        moveCarousel('next');
    }, 3000); // Change slide every 3 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

function moveCarousel(direction) {
    if (direction === 'next') {
        currentSlide++;
        if (currentSlide >= Math.ceil(cards.length / slidesToShow)) {
            currentSlide = 0; // Loop back to start
        }
    } else {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = Math.ceil(cards.length / slidesToShow) - 1; // Loop to end
        }
    }
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    stopAutoSlide();
    startAutoSlide();
}

function updateCarousel() {
    // Update track position
    const slideWidth = 100 / slidesToShow;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth * slidesToShow}%)`;
    
    // Update dots
    Array.from(dots).forEach((dot, index) => {
        dot.className = `w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-[var(--accent-color)]' : 'bg-[var(--border-color)]'}`;
    });
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarousel);

// Single consolidated carousel implementation
document.addEventListener('DOMContentLoaded', function() {
    // Get the carousel elements
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('#carousel-track > div');
    const dotsContainer = document.getElementById('carousel-dots');
    
    // Exit if carousel elements don't exist
    if (!track || !items.length || !dotsContainer) return;
    
    // Initialize variables
    let currentIndex = 0;
    let itemWidth = 0;
    let gap = 24; // gap-6 in Tailwind (24px)
    let autoSlideInterval;
    
    // Create dots based on screen size
    function initializeDots() {
        // Clear existing dots
        dotsContainer.innerHTML = '';
        
        // Get number of visible slides based on screen width
        let visibleSlides;
        if (window.innerWidth <= 640) { // Small mobile
            visibleSlides = 1;
        } else if (window.innerWidth <= 768) { // Mobile
            visibleSlides = 1;
        } else if (window.innerWidth <= 1024) { // Tablet
            visibleSlides = 2;
        } else { // Desktop
            visibleSlides = 3;
        }
        
        // Calculate number of dots needed (total slides / visible slides)
        const totalDots = Math.ceil(items.length / visibleSlides);
        
        // Create dots
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot', 'w-3', 'h-3', 'rounded-full');
            
            if (i === 0) {
                dot.classList.add('bg-[var(--accent-color)]');
            } else {
                dot.classList.add('bg-[var(--border-color)]');
            }
            
            dot.setAttribute('aria-label', `Slide group ${i+1}`);
            dot.addEventListener('click', function() {
                goToSlide(i * visibleSlides);
            });
            
            dotsContainer.appendChild(dot);
        }
        
        return visibleSlides;
    }
    
    // Update carousel position
    function updateCarousel() {
        if (!track || items.length === 0) return;
        
        // Get updated item width (responsive)
        itemWidth = items[0].offsetWidth;
        
        // Move carousel to current index
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        
        // Update dots
        updateDots();
    }
    
    // Update active dot
    function updateDots() {
        const visibleSlides = getVisibleSlidesCount();
        const dots = document.querySelectorAll('.carousel-dot');
        const activeDotIndex = Math.floor(currentIndex / visibleSlides);
        
        dots.forEach((dot, i) => {
            if (i === activeDotIndex) {
                dot.classList.add('bg-[var(--accent-color)]');
                dot.classList.remove('bg-[var(--border-color)]');
            } else {
                dot.classList.add('bg-[var(--border-color)]');
                dot.classList.remove('bg-[var(--accent-color)]');
            }
        });
    }
    
    // Get number of visible slides based on screen width
    function getVisibleSlidesCount() {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    // Move to specific slide
    function goToSlide(index) {
        // Check if index is valid
        if (index < 0) {
            currentIndex = items.length - 1;
        } else if (index >= items.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        // Update carousel
        updateCarousel();
        
        // Reset auto slide timer
        resetAutoSlide();
    }
    
    // Auto slide functionality
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            moveCarousel('next');
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Public function to move carousel
    window.moveCarousel = function(direction) {
        const visibleSlides = getVisibleSlidesCount();
        
        if (direction === 'next') {
            let nextIndex = currentIndex + visibleSlides;
            // If we're at the end, loop back to start
            if (nextIndex >= items.length) {
                nextIndex = 0;
            }
            goToSlide(nextIndex);
        } else if (direction === 'prev') {
            let prevIndex = currentIndex - visibleSlides;
            // If we're at the start, loop to end
            if (prevIndex < 0) {
                prevIndex = Math.max(0, items.length - visibleSlides);
            }
            goToSlide(prevIndex);
        }
    };
    
    // Add navigation buttons class for styling
    const prevButton = document.querySelector('button[onclick="moveCarousel(\'prev\')"]');
    const nextButton = document.querySelector('button[onclick="moveCarousel(\'next\')"]');
    
    if (prevButton) prevButton.classList.add('prev-button');
    if (nextButton) nextButton.classList.add('next-button');
    
    // Initialize carousel
    initializeDots();
    updateCarousel();
    startAutoSlide();
    
    // Pause auto-sliding on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    
    // Update on window resize
    window.addEventListener('resize', function() {
        initializeDots();
        updateCarousel();
    });
}); 