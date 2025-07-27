// Navigation and scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const contactForm = document.getElementById('contactForm');

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Navigation functionality
    function navigateToSection(sectionId) {
        // Find the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Calculate position with header offset
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            // Smooth scroll to target section
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');

        // Update URL hash
        history.pushState(null, null, `#${sectionId}`);
    }

    // Add click listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Footer navigation links
    const footerLinks = document.querySelectorAll('.footer-section a[data-section]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });

    // Handle initial page load with hash
    function handleInitialHash() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            setTimeout(() => navigateToSection(hash), 100);
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        handleInitialHash();
    });

    // Initialize page
    handleInitialHash();

    // Contact form functionality
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate required fields
            const requiredFields = ['name', 'email', 'message'];
            let isValid = true;
            const errors = [];

            requiredFields.forEach(field => {
                if (!formObject[field] || formObject[field].trim() === '') {
                    isValid = false;
                    errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                }
            });

            // Validate email format
            if (formObject.email && !isValidEmail(formObject.email)) {
                isValid = false;
                errors.push('Please enter a valid email address');
            }

            if (!isValid) {
                showFormMessage(errors.join(', '), 'error');
                return;
            }

            // Simulate form submission
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Form validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.padding = '1rem';
        messageDiv.style.marginTop = '1rem';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.fontSize = '0.9rem';
        messageDiv.style.fontWeight = '500';
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d1fae5';
            messageDiv.style.color = '#065f46';
            messageDiv.style.border = '1px solid #a7f3d0';
        } else {
            messageDiv.style.backgroundColor = '#fee2e2';
            messageDiv.style.color = '#991b1b';
            messageDiv.style.border = '1px solid #fca5a5';
        }

        // Insert message after form
        contactForm.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Smooth animations on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.value-item, .service-category, .project-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize animation elements
    function initAnimations() {
        const elements = document.querySelectorAll('.value-item, .service-category, .project-item');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Initialize animations
    initAnimations();
    animateOnScroll();

    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);

    // Global function for hero CTA button
    window.navigateToSection = navigateToSection;
    
    // Hero CTA button functionality
    const heroBtn = document.getElementById('view-projects-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            navigateToSection('projects');
        });
    }

    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe animation elements
        const animatedElements = document.querySelectorAll('.value-item, .service-category, .project-item');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Add focus styles for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Lazy loading for better performance
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    // Add smooth hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.hero-cta, .form-submit, .nav-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Performance optimization: debounce scroll events
    function debounce(func, wait) {
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

    // Apply debounce to scroll handler
    const debouncedScrollHandler = debounce(function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    // Replace the original scroll event listener
    window.removeEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    window.addEventListener('scroll', debouncedScrollHandler);

    // Scroll ile aktif sekmeyi güncelle
    function updateActiveNavOnScroll() {
        let scrollPos = window.scrollY + header.offsetHeight + 10;
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                const id = section.id;
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('data-section') === id;
                    link.classList.toggle('active', isActive);
                });
            }
        });
    }
   // Listen for scroll events to update active nav
    window.addEventListener('scroll', updateActiveNavOnScroll);
});

const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScroll && currentScroll > 100) {
    // aşağı iniyor, header gizle
    header.classList.add('hidden');
  } else {
    // yukarı çıkıyor, header göster
    header.classList.remove('hidden');
  }
  lastScroll = currentScroll <= 0 ? 0 : currentScroll; // negatif scroll engelleme
});

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNavOnScroll() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 160; // header yüksekliğine göre ayarla
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  }

  // Başlangıçta da çağır ki refresh sonrası çalışsın
  updateActiveNavOnScroll();

  window.addEventListener("scroll", updateActiveNavOnScroll);
});

