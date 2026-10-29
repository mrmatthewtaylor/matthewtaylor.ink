document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. HAMBURGER NAVIGATION TOGGLE
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    function closeNavImmediately() {
        if (hamburgerBtn && navMenu) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // ==========================================
    // 2. MODAL MANAGER (ABOUT & CONTACT)
    // ==========================================
    const aboutModal = document.getElementById('about-modal');
    const navAboutLink = document.getElementById('nav-about-link');
    const closeAboutBtn = aboutModal?.querySelector('.modal-close-btn');

    const contactModal = document.getElementById('contact-modal');
    const contactLink = document.getElementById('nav-contact-link');
    const closeContactBtn = contactModal?.querySelector('.modal-close-btn');

    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('about-open');
            setTimeout(closeNavImmediately, 300);
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('about-open');
        }
    }

    if (navAboutLink) {
        navAboutLink.addEventListener('click', (e) => { 
            e.preventDefault(); 
            openModal(aboutModal); 
        });
    }
    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => closeModal(aboutModal));
    }

    if (contactLink) {
        contactLink.addEventListener('click', (e) => { 
            e.preventDefault(); 
            openModal(contactModal); 
        });
    }
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', () => closeModal(contactModal));
    }

    // ==========================================
    // 3. LIGHTBOX & TOUCH SWIPE
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeBtn = lightbox?.querySelector('.close-btn');
    const prevBtn = lightbox?.querySelector('.prev-btn');
    const nextBtn = lightbox?.querySelector('.next-btn');
    const projectImages = document.querySelectorAll('.project-img');

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateImageSource(index) {
        if (projectImages.length === 0) return;
        if (index < 0) currentIndex = projectImages.length - 1;
        else if (index >= projectImages.length) currentIndex = 0;
        else currentIndex = index;

        const currentImg = projectImages[currentIndex];
        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt;
        if (lightboxTitle) lightboxTitle.textContent = currentImg.alt || '';
    }

    function openLightbox(index) {
        if (!lightbox) return;
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        updateImageSource(index);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    projectImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); updateImageSource(currentIndex + 1); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); updateImageSource(currentIndex - 1); });
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchEndX - touchStartX;
            if (swipeDistance < -50) updateImageSource(currentIndex + 1);
            if (swipeDistance > 50) updateImageSource(currentIndex - 1);
        }, { passive: true });
    }

    // // ==========================================
    // // 4. GLOBAL KEYBOARD LISTENERS (ESCAPE & ARROWS)
    // // ==========================================
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(aboutModal);
            closeModal(contactModal);
            closeLightbox();
        } else if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') updateImageSource(currentIndex + 1);
            if (e.key === 'ArrowLeft') updateImageSource(currentIndex - 1);
        }
    });

    // // ==========================================
    // // 5. BACK TO TOP BUTTON
    // // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) backToTopBtn?.classList.add('show');
        else backToTopBtn?.classList.remove('show');
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 6. SMOOTH SCROLLING FOR ANCHORS
    // ==========================================
    document.querySelectorAll('nav a[href*="#"], footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Exclude modal links from triggering smooth scroll behavior
            if (href === '#contact' || href === '#about' || href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});