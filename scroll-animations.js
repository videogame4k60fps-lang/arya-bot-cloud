/* ============================================
   ARYA Hair Salon - GSAP Scroll Animations
   Fixed: proper final states, scroll reset, no opacity issues
   ============================================ */

// CRITICAL: Force scroll to top immediately (before DOMContentLoaded)
if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
}

// Wait for DOM and GSAP to load
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(initScrollAnimations, 100);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
    }

    // CRITICAL: Clear all scroll memory
    ScrollTrigger.clearScrollMemory();
    ScrollTrigger.refresh();

    // Force scroll to top again after GSAP loads
    window.scrollTo(0, 0);

    // ==========================================
    // SMOOTH SCROLL SETUP (JS-based, not CSS)
    // ==========================================

    gsap.to('.hero-video', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-logo-side', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // ==========================================
    // SECTION REVEAL ANIMATIONS (fromTo for guaranteed final state)
    // ==========================================

    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.fromTo(label, 
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: label,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    gsap.utils.toArray('.section-heading').forEach(heading => {
        gsap.fromTo(heading,
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    gsap.utils.toArray('.section-intro').forEach(intro => {
        gsap.fromTo(intro,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: intro,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ==========================================
    // CHI SIAMO SECTION
    // ==========================================

    gsap.fromTo('.team-photo-wrapper',
        { scale: 0.92, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.team-photo-wrapper',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.team-description h3',
        { y: 40, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.team-description',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.utils.toArray('.team-description p').forEach((p, i) => {
        gsap.fromTo(p,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.team-description',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    gsap.fromTo('.team-description .btn',
        { y: 20, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.team-description',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // ==========================================
    // FONDATORE SECTION
    // ==========================================

    gsap.fromTo('.fondatore-image',
        { x: -60, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1.4, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.fondatore-grid',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.fondatore-content .section-label',
        { y: 30, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.fondatore-content',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.fondatore-content .section-heading',
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.fondatore-content',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.utils.toArray('.fondatore-text').forEach((text, i) => {
        gsap.fromTo(text,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.fondatore-content',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    gsap.utils.toArray('.stat').forEach((stat, i) => {
        gsap.fromTo(stat,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.fondatore-stats',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ==========================================
    // SERVIZI SECTION
    // ==========================================

    gsap.fromTo('.services .section-heading',
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.services',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ==========================================
    // SALONE SECTION - Parallax image
    // ==========================================

    gsap.to('.salon-image img', {
        yPercent: -8,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
            trigger: '.salon',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.fromTo('.salon-content',
        { x: 50, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.salon-content',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // ==========================================
    // PORTFOLIO SECTION - Staggered reveal
    // ==========================================

    gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
        gsap.fromTo(item,
            { y: 60, opacity: 0, scale: 0.95 },
            {
                y: 0, opacity: 1, scale: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.portfolio-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ==========================================
    // REVIEWS SECTION
    // ==========================================

    gsap.utils.toArray('.review-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.reviews-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    gsap.fromTo('.rating-badge',
        { scale: 0.8, opacity: 0 },
        {
            scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: '.rating-badge',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // ==========================================
    // PRODUCTS SECTION
    // ==========================================

    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, delay: i * 0.12, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.products-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ==========================================
    // CONTACT SECTION
    // ==========================================

    gsap.fromTo('.contact-info',
        { x: -40, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.contact-map',
        { x: 40, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // ==========================================
    // FOOTER REVEAL
    // ==========================================

    gsap.utils.toArray('.footer-content > *').forEach((el, i) => {
        gsap.fromTo(el,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.footer',
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ==========================================
    // CHAT AGENT - Message animations
    // ==========================================
    
    const chatMessages = document.getElementById('aiChatMessages');
    if (chatMessages) {
        const observer = new MutationObserver(() => {
            const newMessages = chatMessages.querySelectorAll('.chat-message:not(.animated)');
            newMessages.forEach(msg => {
                msg.classList.add('animated');
                gsap.fromTo(msg,
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
                );
            });
        });
        observer.observe(chatMessages, { childList: true, subtree: true });
    }

    // ==========================================
    // IMAGE HOVER ENHANCEMENTS
    // ==========================================

    gsap.utils.toArray('.portfolio-item').forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(img, { scale: 1.08, duration: 0.6, ease: 'power2.out' });
            gsap.to(overlay, { y: 0, duration: 0.4, ease: 'power2.out' });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
            gsap.to(overlay, { y: '100%', duration: 0.3, ease: 'power2.in' });
        });
    });

    gsap.utils.toArray('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -8, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
        });
    });

    // ==========================================
    // SMOOTH SCROLL FOR DATA-TARGET LINKS
    // ==========================================

    document.querySelectorAll('a[data-target]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // REFRESH ON RESIZE
    // ==========================================

    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    console.log('ARYA - GSAP Scroll Animations loaded ✨');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}
