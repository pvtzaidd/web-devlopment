const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about-image, .project-card, .contact-form');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
};

const skills = document.querySelectorAll('.skill-progress');
const animateSkills = () => {
    const aboutSection = document.querySelector('#about');
    const aboutPosition = aboutSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (aboutPosition < windowHeight - 100) {
        skills.forEach(skill => {
            const width = skill.getAttribute('data-width');
            skill.style.width = width;
        });
        window.removeEventListener('scroll', animateSkills);
    }
};

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateOnScroll);

// Form Submission (Prevent Default for Demo)
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We’ll get back to you soon.');
    contactForm.reset();
});