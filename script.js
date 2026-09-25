/* ============================================================
   Portfolio — Luis Miguel Ospino Acuña
   Vanilla JS · sin dependencias
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Cerrar el menú al elegir una sección
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sección activa en la navegación ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- Animación reveal al hacer scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Efecto máquina de escribir en el hero ---------- */
  var typeEl = document.getElementById('typewriter');
  var roles = [
    'Ingeniero Electrónico en formación',
    'Automatización · IoT · Full Stack',
    'Diseño electrónico y firmware',
    'Backend Go · Frontend React'
  ];

  if (typeEl) {
    var ri = 0, ci = 0, deleting = false;

    function type() {
      var word = roles[ri];
      var speed = deleting ? 38 : 72;

      if (!deleting) {
        typeEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; speed = 1800; }
      } else {
        typeEl.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; speed = 350; }
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 600);
  }

  /* ---------- Año dinámico en el footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
    yearEl.textContent = Math.max(yearEl.textContent, 2026);
  }

  /* ---------- Formulario de contacto (FormSubmit AJAX) ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var cfStatus = document.getElementById('cfStatus');
    var cfSubmit = document.getElementById('cfSubmit');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var payload = {};
      new FormData(contactForm).forEach(function (value, key) {
        payload[key] = value;
      });

      cfSubmit.disabled = true;
      cfStatus.textContent = 'Enviando...';
      cfStatus.className = 'cf-status sending';

      fetch('https://formsubmit.co/ajax/luispino32@hotmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('request failed');
          return res.json();
        })
        .then(function () {
          cfStatus.textContent = 'Mensaje enviado. Gracias por escribirme, te respondo a la brevedad.';
          cfStatus.className = 'cf-status ok';
          contactForm.reset();
        })
        .catch(function () {
          cfStatus.textContent = 'No se pudo enviar el mensaje. Escribime directo a luispino32@hotmail.com.';
          cfStatus.className = 'cf-status err';
        })
        .finally(function () {
          cfSubmit.disabled = false;
        });
    });
  }
})();