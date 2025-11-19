(function () {
  'use strict';

  // Mobile menu toggle (works with pages that use #mobile-menu and #mobile-menu-button)
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      if (iconOpen) iconOpen.classList.toggle('hidden');
      if (iconClose) iconClose.classList.toggle('hidden');
    });
  }

  // Smooth scroll for same-page anchors
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href === '#' || href === '#!' ) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        window.setTimeout(() => target.removeAttribute('tabindex'), 1000);
      }
    });
  }

  // IntersectionObserver reveal for elements with .fade-up
  function initReveal() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('show');
          obs.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  }

  // Basic form helper: validate email pattern
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||'').trim());
  }

  // Contact form handler (no API): opens mailto or wa link, or simulates submission
  function handleContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[name="name"], #contact-name, #modal-contact-name')?.value || '';
      const email = form.querySelector('input[type="email"]')?.value || '';
      const message = form.querySelector('textarea')?.value || '';
      if (!name.trim() || !email.trim() || !message.trim()) {
        alert('Mohon isi semua kolom sebelum mengirim.');
        return;
      }
      if (!isValidEmail(email)) {
        alert('Mohon masukkan email yang valid.');
        return;
      }
      // Simulasi: open mail client with prefilled subject + body
      const subject = encodeURIComponent(`Pesan dari ${name} — TripNesia`);
      const body = encodeURIComponent(`${message}\n\nNama: ${name}\nEmail: ${email}`);
      // Use mailto (no backend)
      window.location.href = `mailto:info@tripnesia.com?subject=${subject}&body=${body}`;
    });
  }

  // Register form handler (client-side validation + simulated success)
  function handleRegisterForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = form.querySelector('input[name="fullName"], input[name="nama"], #fullName')?.value || '';
      const email = form.querySelector('input[name="email"], #email')?.value || '';
      const wa = form.querySelector('input[name="whatsapp"], #whatsapp')?.value || '';
      const pw = form.querySelector('input[name="password"], #password')?.value || '';
      const confirm = form.querySelector('input[name="confirmPassword"], input[name="confirm_password"], #confirmPassword')?.value || '';

      if (!fullName.trim()) { alert('Nama lengkap wajib diisi.'); return; }
      if (!isValidEmail(email)) { alert('Masukkan email valid.'); return; }
      if (!wa.trim()) { alert('Nomor WhatsApp wajib diisi.'); return; }
      if (pw.length < 8) { alert('Password minimal 8 karakter.'); return; }
      if (pw !== confirm) { alert('Konfirmasi password tidak cocok.'); return; }

      // Simulate success (no API)
      alert('Pendaftaran berhasil (simulasi). Anda akan diarahkan ke halaman login.');
      window.location.href = '/login.html';
    });
  }

  // Generic initialization for commonly used form IDs across your pages
  function initForms() {
    // contact forms (page & modal)
    handleContactForm('contact-form');
    handleContactForm('modal-contact-form');

    // register forms
    handleRegisterForm('register-form');
    handleRegisterForm('regist-form'); // possible alt id
    handleRegisterForm('registerForm');
  }

  // Utility: add lazy attr to images that don't have it (progressive enhancement)
  function ensureLazyImages() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initForms();
    ensureLazyImages();
  });

})();