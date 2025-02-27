class DigitalActivatorAnimation {
    constructor() {
        this.canvas = document.getElementById('digital-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.nodes = [];
        this.connections = [];
        
        // Initialize immediately
        this.setupCanvas();
        this.createNodes();
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createNodes();
            this.createParticles();
        });

        // Handle theme changes
        this.observer = new MutationObserver(() => {
            this.updateColors();
        });

        this.observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });
    }

    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createNodes() {
        this.nodes = [];
        const numberOfNodes = 5;
        const spacing = this.canvas.width / (numberOfNodes + 1);
        
        for (let i = 0; i < numberOfNodes; i++) {
            this.nodes.push({
                x: spacing * (i + 1),
                y: this.canvas.height / 2,
                radius: 4,
                pulseRadius: 0,
                pulseOpacity: 1
            });
        }
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
                opacity: Math.random() * 0.5 + 0.3,
                connectionRadius: 100
            });
        }
    }

    updateColors() {
        const style = getComputedStyle(document.body);
        this.accentColor = style.getPropertyValue('--accent-color').trim() || '#22c55e';
    }

    drawNode(node) {
        // Draw pulse effect
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.accentColor;
        this.ctx.globalAlpha = node.pulseOpacity;
        this.ctx.fill();

        // Draw node
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.accentColor;
        this.ctx.globalAlpha = 1;
        this.ctx.fill();
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.accentColor;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fill();
    }

    drawConnections() {
        // Draw connections between particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.particles[i].connectionRadius) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.accentColor;
                    this.ctx.globalAlpha = (1 - distance / this.particles[i].connectionRadius) * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }

        // Draw connections to nodes
        this.particles.forEach(particle => {
            this.nodes.forEach(node => {
                const dx = particle.x - node.x;
                const dy = particle.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particle.connectionRadius) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(node.x, node.y);
                    this.ctx.strokeStyle = this.accentColor;
                    this.ctx.globalAlpha = (1 - distance / particle.connectionRadius) * 0.3;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
        });

        // Update node pulse effects
        this.nodes.forEach(node => {
            node.pulseRadius += 0.5;
            node.pulseOpacity -= 0.01;

            if (node.pulseRadius > 30) {
                node.pulseRadius = 0;
                node.pulseOpacity = 1;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.particles.forEach(particle => this.drawParticle(particle));
        this.nodes.forEach(node => this.drawNode(node));
        this.updateParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalActivatorAnimation();
}); 