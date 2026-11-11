(function () {
'use strict';

var TOAST_MS = 2200;
var STAGGER  = 60;

var yearSpan     = document.getElementById('year');
var toast        = document.getElementById('copied-toast');
var toastText    = document.getElementById('toast-text');
var contactBtn   = document.getElementById('btn');
var contactPanel = document.getElementById('contact-panel');
var socialBtn    = document.getElementById('social-btn');
var socialPanel  = document.getElementById('social-panel');
var backToTop    = document.getElementById('back-to-top');
var progress     = document.getElementById('reading-progress');
var printBtn     = document.getElementById('print-btn');
var themeToggle  = document.getElementById('theme-toggle');
var cmdOverlay   = document.getElementById('cmd-overlay');
var cmdInput     = document.getElementById('cmd-input');
var cmdResults   = document.getElementById('cmd-results');
var cmdTrigger   = document.getElementById('cmd-trigger');
var cursorDot    = document.getElementById('cursor-dot');
var easterEgg    = document.getElementById('easter-egg');
var easterClose  = document.getElementById('easter-close');

if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Theme
(function () {
  var saved = 'dark';
  try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
  document.documentElement.setAttribute('data-theme', saved);
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();

// Reading progress
window.addEventListener('scroll', function () {
  if (!progress) return;
  var docH = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
}, { passive: true });

// Back to top
window.addEventListener('scroll', function () {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
if (backToTop) {
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Print
if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

// Cursor dot
(function () {
  if (!cursorDot) return;
  var mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  (function follow() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursorDot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(follow);
  })();
  document.addEventListener('mouseleave', function () { cursorDot.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { cursorDot.style.opacity = '1'; });
  document.querySelectorAll('a,button,.project-card,.skill-bar-item,.cert-item').forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursorDot.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { cursorDot.classList.remove('hover'); });
  });
})();

// Scroll reveal
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Skill bars
(function () {
  var bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var pct = en.target.dataset.pct || '0';
      setTimeout(function () { en.target.style.width = pct + '%'; }, 100);
      io.unobserve(en.target);
    });
  }, { threshold: 0.3 });
  bars.forEach(function (b) { io.observe(b); });
})();

// Stats counter
(function () {
  var nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseInt(el.dataset.target, 10);
      var n = 0;
      var timer = setInterval(function () {
        n++;
        el.textContent = n;
        if (n >= target) clearInterval(timer);
      }, 1200 / target);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(function (el) { io.observe(el); });
})();

// Typing animation
(function () {
  var el = document.getElementById('typing-text');
  if (!el) return;
  var phrases = [
    'Full Stack Developer',
    'OSINT Researcher',
    'Digital Investigator',
    'Cybersecurity Enthusiast',
    'Network Engineer'
  ];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }
  var pi = 0, ci = 0, del = false, paused = false;

  function tick() {
    var cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) {
        paused = true;
        setTimeout(function () { paused = false; del = true; loop(); }, 1800);
        return;
      }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    loop();
  }
  function loop() { if (!paused) setTimeout(tick, del ? 45 : 80); }
  loop();
})();

// Toast + clipboard
function showToast(label) {
  toastText.textContent = label + ' copied ✓';
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, TOAST_MS);
}

function fallbackCopy(text, label) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast(label); } catch (e) {}
  document.body.removeChild(ta);
}

function copyText(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(function () { showToast(label); })
      .catch(function () { fallbackCopy(text, label); });
  } else {
    fallbackCopy(text, label);
  }
}

document.querySelectorAll('.copyable').forEach(function (item) {
  var label = item.dataset.label || 'Value';
  item.addEventListener('click', function () { copyText(item.dataset.copy, label); });
  item.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyText(item.dataset.copy, label); }
  });
});

// Collapsible panels
function setupToggle(btnEl, panelEl, openLabel, closeLabel) {
  if (!btnEl || !panelEl) return;
  btnEl.innerHTML = '<span class="btn-label">' + closeLabel + '</span><span class="btn-arrow" aria-hidden="true">→</span>';

  btnEl.addEventListener('click', function () {
    var isOpen = panelEl.classList.contains('open');
    panelEl.classList.toggle('open', !isOpen);
    panelEl.hidden = isOpen;
    btnEl.classList.toggle('open', !isOpen);
    btnEl.setAttribute('aria-expanded', String(!isOpen));
    btnEl.querySelector('.btn-label').textContent = isOpen ? closeLabel : openLabel;

    var items = panelEl.querySelectorAll('.contact-item');
    if (isOpen) {
      items.forEach(function (el) { el.classList.remove('visible'); });
    } else {
      items.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('visible'); }, i * STAGGER);
      });
    }
  });
}

setupToggle(contactBtn, contactPanel, 'Hide contact',  'Get in touch');
setupToggle(socialBtn,  socialPanel,  'Hide profiles', 'View profiles');

// Command palette
(function () {
  if (!cmdOverlay) return;

  var sections = [
    { id: 'sec-about',       label: 'About',       icon: '👤' },
    { id: 'sec-projects',    label: 'Projects',    icon: '🚀' },
    { id: 'sec-research',    label: 'Research interests', icon: '🔬' },
    { id: 'sec-skills',      label: 'Skills',      icon: '⚡' },
    { id: 'sec-experience',  label: 'Experience',  icon: '💼' },
    { id: 'sec-credentials', label: 'Credentials', icon: '🎓' },
    { id: 'sec-contact',     label: 'Contact',     icon: '✉' },
    { id: 'sec-profiles',    label: 'Profiles',    icon: '🔗' }
  ];
  var active = 0;

  function renderResults(list) {
    cmdResults.innerHTML = '';
    active = 0;
    list.forEach(function (item, i) {
      var b = document.createElement('button');
      b.className = 'cmd-item' + (i === 0 ? ' cmd-active' : '');
      b.innerHTML = '<span class="cmd-icon">' + item.icon + '</span><span class="cmd-label">' + item.label + '</span>';
      b.addEventListener('click', function () { goTo(item.id); });
      cmdResults.appendChild(b);
    });
  }

  var previousFocus = null;
  function openCmd() {
    previousFocus = document.activeElement;
    cmdOverlay.classList.add('open');
    cmdOverlay.removeAttribute('aria-hidden');
    cmdInput.value = '';
    renderResults(sections);
    setTimeout(function () { cmdInput.focus(); }, 50);
  }

  function closeCmd() {
    cmdOverlay.classList.remove('open');
    cmdOverlay.setAttribute('aria-hidden', 'true');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    closeCmd();
    setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }

  function setActive(i) {
    var items = cmdResults.querySelectorAll('.cmd-item');
    if (!items.length) return;
    items[active].classList.remove('cmd-active');
    active = Math.max(0, Math.min(i, items.length - 1));
    items[active].classList.add('cmd-active');
    items[active].scrollIntoView({ block: 'nearest' });
  }

  cmdInput.addEventListener('input', function () {
    var q = cmdInput.value.toLowerCase();
    renderResults(sections.filter(function (s) { return s.label.toLowerCase().indexOf(q) !== -1; }));
  });

  cmdInput.addEventListener('keydown', function (e) {
    var items = cmdResults.querySelectorAll('.cmd-item');
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) { cmdInput.focus(); } else if (items.length) { items[active].focus(); }
      return;
    }
    if (e.key === 'ArrowDown')      { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter')     { if (items[active]) items[active].click(); }
    else if (e.key === 'Escape')    { closeCmd(); }
  });

  cmdResults.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') { e.preventDefault(); cmdInput.focus(); }
    if (e.key === 'Escape') closeCmd();
  });
  cmdOverlay.addEventListener('click', function (e) { if (e.target === cmdOverlay) closeCmd(); });
  if (cmdTrigger) cmdTrigger.addEventListener('click', openCmd);

  document.addEventListener('keydown', function (e) {
    var typing = document.activeElement && document.activeElement.tagName === 'INPUT';
    if ((e.key === '/' && !e.ctrlKey && !e.metaKey && !typing) || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
      e.preventDefault();
      cmdOverlay.classList.contains('open') ? closeCmd() : openCmd();
    }
    if (e.key === 'Escape') closeCmd();
  });
})();

// Konami code
(function () {
  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
  var idx = 0;
  document.addEventListener('keydown', function (e) {
    if (e.key === seq[idx]) {
      idx++;
      if (idx === seq.length) { if (easterEgg) easterEgg.classList.add('show'); idx = 0; }
    } else {
      idx = 0;
    }
  });
  if (easterClose) easterClose.addEventListener('click', function () { easterEgg.classList.remove('show'); });
})();

})();