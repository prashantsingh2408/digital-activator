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