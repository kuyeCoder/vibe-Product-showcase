// Product Gallery JavaScript
class ProductGallery {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.cards = document.querySelectorAll('.product-card');
        this.viewButtons = document.querySelectorAll('.view-btn');
        
        this.init();
    }

    init() {
        this.loadTheme();
        this.bindEvents();
        this.initAnimations();
        this.setupIntersectionObserver();
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.body.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = this.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add transition effect to theme toggle
        this.themeToggle.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.setTheme(newTheme);
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    updateThemeIcon(theme) {
        const icon = this.themeToggle.querySelector('.toggle-icon');
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
        
        // Add rotation animation
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
        }, 300);
    }

    // Event Binding
    bindEvents() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard support for theme toggle
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // View button interactions
        this.viewButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => this.handleViewClick(e, index));
        });

        // Card hover effects
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    // Animation Management
    initAnimations() {
        // Add staggered animation delays to cards
        this.cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Trigger fade-in animations
        setTimeout(() => {
            this.cards.forEach(card => {
                card.classList.add('fade-in');
            });
        }, 100);
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    this.animateCard(entry.target);
                }
            });
        }, options);

        this.cards.forEach(card => {
            observer.observe(card);
        });
    }

    animateCard(card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }

    // Event Handlers
    handleViewClick(e, index) {
        e.preventDefault();
        const button = e.target;
        const card = button.closest('.product-card');
        const productTitle = card.querySelector('.card-title').textContent;
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Simulate product view (in a real app, this would navigate to product page)
        this.showProductModal(productTitle, index);
    }

    handleCardHover(card, isHovering) {
        const image = card.querySelector('.card-image img');
        const overlay = card.querySelector('.card-overlay');
        
        if (isHovering) {
            card.style.zIndex = '10';
            this.addRippleEffect(card);
        } else {
            card.style.zIndex = '1';
        }
    }

    handleResize() {
        // Recalculate animations on resize
        this.cards.forEach(card => {
            card.style.transition = 'none';
            setTimeout(() => {
                card.style.transition = '';
            }, 100);
        });
    }

    handleKeyboardNavigation(e) {
        // Add keyboard navigation for accessibility
        if (e.key === 'Tab') {
            this.highlightFocusedElement();
        }
    }

    // Utility Functions
    addRippleEffect(card) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        card.style.position = 'relative';
        card.appendChild(ripple);

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showProductModal(productTitle, index) {
        // Create a simple modal for demonstration
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--bg-card);
            padding: 2rem;
            border-radius: 20px;
            max-width: 400px;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <h2 style="color: var(--text-primary); margin-bottom: 1rem;">${productTitle}</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Product details would be displayed here in a real application.</p>
            <button class="close-modal" style="
                background: var(--text-accent);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
            ">Close</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animate modal in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Close modal functionality
        const closeBtn = modalContent.querySelector('.close-modal');
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Keyboard support
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    highlightFocusedElement() {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('theme-toggle')) {
            focusedElement.style.boxShadow = '0 0 0 3px var(--text-accent)';
            setTimeout(() => {
                focusedElement.style.boxShadow = '';
            }, 2000);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance optimization
    preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new ProductGallery();
    
    // Add loading animation to images
    const images = document.querySelectorAll('.card-image img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
            console.warn('Failed to load image:', img.src);
        });
    });

    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductGallery;
}

