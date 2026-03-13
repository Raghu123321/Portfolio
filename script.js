/* ══════════════════════════════════════════════════
   MASTER CODE — script.js
   Smooth scroll · Reveal · 3D Tilt · Navbar
   ══════════════════════════════════════════════════ */

'use strict';

// ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();

        const navH = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;

        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        const menu = document.getElementById('navMenu');
        const toggle = document.getElementById('navToggle');
        if (menu.classList.contains('open')) {
            menu.classList.remove('open');
            toggle.classList.remove('open');
        }
    });
});

// ── NAVBAR — SCROLL STATE & ACTIVE LINK ─────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
    // Scrolled style
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    const navH = navbar.offsetHeight;

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - navH - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ── MOBILE NAV TOGGLE ────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// ── SCROLL REVEAL ────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Re-animate when scrolling back up
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── 3D TILT EFFECT ────────────────────────────────────
function initTilt() {
    const TILT_MAX = 6;   // softened max degrees of tilt
    const SCALE_HOVER = 1.02;
    const PERSPECTIVE = 1000; // gentler perspective

    document.querySelectorAll('.tilt-card').forEach(card => {
        let rafId = null;

        function applyTilt(rx, ry, scale) {
            card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
        }

        card.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);

                const rotateY = dx * TILT_MAX;
                const rotateX = -dy * TILT_MAX;

                applyTilt(rotateX, rotateY, SCALE_HOVER);
            });
        });

        card.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            // Smooth snap back
            card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
            applyTilt(0, 0, 1);

            // Remove transition after snap so mousemove feels immediate
            setTimeout(() => {
                card.style.transition = '';
            }, 600);
        });
    });
}

initTilt();

// ── HERO STATS COUNTER ANIMATION ─────────────────────
function animateCounter(el, target, isNum) {
    if (!isNum) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + (el.dataset.suffix || '');
        if (current >= target) clearInterval(timer);
    }, 25);
}

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(el => {
            const val = parseInt(el.textContent, 10);
            if (!isNaN(val)) animateCounter(el, val, true);
        });
    }
}, { threshold: 0.5 });

if (document.querySelector('.hero-stats')) {
    statsObserver.observe(document.querySelector('.hero-stats'));
}
