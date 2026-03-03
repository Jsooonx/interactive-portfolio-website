document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Mobile Navigation Toggle
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Toggle ARIA expanded
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ==========================================================================
       Smooth Scrolling
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Determine offset for fixed header
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ==========================================================================
       Active Link Highlighting (Intersection Observer)
       ========================================================================== */
    const sections = document.querySelectorAll('section, header#hero');

    // Add logic to IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');

                // Remove active class from all links
                navItems.forEach(item => {
                    item.classList.remove('active');

                    // Add active class to corresponding link
                    if (item.getAttribute('href') === `#${currentId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       FAQ Accordion
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all currently open FAQ items
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            // If the clicked one wasn't expanded, open it
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       Scroll Reveal Animations
       ========================================================================== */
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================================================
       About Section — Carousel Dot Sync & Keyboard Navigation
       ========================================================================== */
    const carousel = document.getElementById('about-carousel');
    const dots = document.querySelectorAll('.about-dot');

    if (carousel && dots.length) {
        // Update the active dot based on scroll position
        function updateDots() {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = carousel.scrollWidth / dots.length;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        }

        // Debounce scroll listener for performance
        let scrollTimer;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateDots, 50);
        }, { passive: true });

        // Dot click → scroll to that card
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = Number(dot.dataset.index);
                const cardWidth = carousel.scrollWidth / dots.length;
                carousel.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
            });
        });

        // Keyboard arrow navigation when carousel is focused
        carousel.addEventListener('keydown', (e) => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = carousel.scrollWidth / dots.length;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                carousel.scrollTo({ left: scrollLeft + cardWidth, behavior: 'smooth' });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                carousel.scrollTo({ left: scrollLeft - cardWidth, behavior: 'smooth' });
            }
        });
    }
});
