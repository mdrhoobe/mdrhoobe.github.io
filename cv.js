/* Language chooser for dynamically generated English PDF and printable Arabic CV. */
(function () {
  'use strict';
  function init() {
    var cvLink = document.getElementById('cv-download-btn');
    if (!cvLink) return;
    function generate() {
      try {
        if (!window.CvPdfGenerator || !window.CV_PROFILE) throw Error('PDF generator scripts not loaded');
        window.CvPdfGenerator.download(window.CV_PROFILE);
      } catch (err) {
        console.error('CV PDF generation failed:', err);
        window.alert('Could not generate the PDF. Please refresh the page and try again.');
      }
    }
    cvLink.addEventListener('click', generate);
    var wrapper = document.createElement('div');
    wrapper.className = 'cv-btn-wrapper';
    cvLink.parentNode.insertBefore(wrapper, cvLink);
    wrapper.appendChild(cvLink);

    var trigger = document.createElement('button');
    trigger.className = 'cv-lang-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'cv-language-menu');
    trigger.setAttribute('aria-label', 'Choose CV language');
    trigger.innerHTML = '<span class="cv-lang-selected-code">EN</span>' +
      '<svg class="cv-lang-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">' +
      '<path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    wrapper.appendChild(trigger);

    var menu = document.createElement('div');
    menu.id = 'cv-language-menu';
    menu.className = 'cv-lang-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'CV language');

    function group(text, dim) {
      var g = document.createElement('div');
      g.className = 'cv-menu-group-label' + (dim ? ' cv-menu-group-label--dim' : '');
      g.textContent = text;
      menu.appendChild(g);
    }

    function item(data, disabled, active) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cv-menu-item' + (disabled ? ' cv-menu-item--disabled' : '') + (active ? ' active' : '');
      b.disabled = !!disabled;
      b.dataset.lang = data.code;
      b.setAttribute('role', 'menuitem');
      b.setAttribute('tabindex', '-1');
      b.innerHTML =
        '<span class="cv-menu-flag' + (disabled ? ' cv-menu-flag--dim' : '') + '">' + data.code.toUpperCase() + '</span>' +
        '<span class="cv-menu-label' + (disabled ? ' cv-menu-label--dim' : '') + '">' + data.label + '</span>' +
        '<span class="cv-menu-note">' + data.note + '</span>';
      menu.appendChild(b);
    }
    group('Available', false);
    item({code:'en', label:'English', note:'Generate PDF'}, false, true);
    item({code:'ar', label:'العربية', note:'Open printable CV'}, false, false);
    group('Unavailable', true);
    [
      {code:'ko',label:'한국어',note:'Not translated'},
      {code:'ja',label:'日本語',note:'Not translated'},
      {code:'zh',label:'中文',note:'Not translated'}
    ].forEach(function (data) { item(data, true, false); });
    wrapper.appendChild(menu);

    var isOpen = false;
    function availableItems() {
      return Array.prototype.slice.call(menu.querySelectorAll('.cv-menu-item:not([disabled])'));
    }
    function positionMenu() {
      var r = trigger.getBoundingClientRect();
      menu.style.top = (r.bottom + 8) + 'px';
      menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 12)) + 'px';
    }
    function openMenu(focusFirst) {
      isOpen = true;
      menu.classList.add('open');
      trigger.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      positionMenu();
      if (focusFirst) availableItems()[0].focus();
    }
    function closeMenu(returnFocus) {
      isOpen = false;
      menu.classList.remove('open');
      trigger.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen) closeMenu(false);
      else openMenu(false);
    });
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (!isOpen) {
          e.preventDefault();
          openMenu(true);
        }
      }
    });
    menu.addEventListener('keydown', function (e) {
      var items = availableItems();
      var i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
      }
      if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); items[items.length-1].focus(); }
    });
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
      var b = e.target.closest('.cv-menu-item:not([disabled])');
      if (!b) return;
      if (b.dataset.lang === 'ar') {
        window.open('cv-ar.html', '_blank', 'noopener,noreferrer');
      } else if (b.dataset.lang === 'en') {
        cvLink.click();
      }
      closeMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (isOpen && !wrapper.contains(e.target)) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (isOpen && e.key === 'Escape') closeMenu(true);
    });
    window.addEventListener('scroll', function () { if (isOpen) positionMenu(); }, {passive:true});
    window.addEventListener('resize', function () { if (isOpen) positionMenu(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
