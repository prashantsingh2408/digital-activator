class DigitalActivatorAnimation {
    constructor() {
        this.canvas = document.getElementById('digital-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        
        // Initialize immediately
        this.setupCanvas();
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createParticles();
        });
    }

    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        const numberOfParticles = Math.min(this.canvas.width / 20, 50);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * 1,
                speedY: (Math.random() - 0.5) * 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawParticle(particle) {
        const style = getComputedStyle(document.body);
        const accentColor = style.getPropertyValue('--accent-color').trim() || '#22c55e';
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = accentColor;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fill();
    }

    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const style = getComputedStyle(document.body);
                    const accentColor = style.getPropertyValue('--accent-color').trim() || '#22c55e';
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = accentColor;
                    this.ctx.globalAlpha = (1 - distance / maxDistance) * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.particles.forEach(particle => this.drawParticle(particle));
        this.updateParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalActivatorAnimation();
}); 