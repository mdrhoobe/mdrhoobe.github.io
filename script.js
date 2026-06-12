/**
 * script.js — Mohammed Saleh Portfolio
 * ─────────────────────────────────────
 * Responsibilities:
 *  1. Inject the current year into the footer.
 *  2. Toggle the Contact panel open/closed (email, phone).
 *  3. Toggle the Profiles panel open/closed (social links).
 *  4. Copy text to clipboard when a copyable item is clicked.
 *  5. Show a labelled toast notification after a successful copy.
 *  6. Stagger-animate panel items on open for a polished entrance.
 *  7. Full keyboard accessibility (Enter / Space on all interactive elements).
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** Duration (ms) the toast notification stays visible. */
const TOAST_DURATION_MS = 2200;

/** Delay (ms) between each staggered item animation inside a panel. */
const STAGGER_MS = 60;

// ─── DOM References ──────────────────────────────────────────────────────────

const yearSpan   = document.getElementById('year');
const toast      = document.getElementById('copied-toast');
const toastText  = document.getElementById('toast-text');

// Contact panel (email + phone)
const contactBtn   = document.getElementById('btn');
const contactPanel = document.getElementById('contact-panel');

// Profiles panel (social links)
const socialBtn   = document.getElementById('social-btn');
const socialPanel = document.getElementById('social-panel');

// ─── 1. Footer Year ───────────────────────────────────────────────────────────

yearSpan.textContent = new Date().getFullYear();

// ─── 2 & 3. Panel Toggle Logic ───────────────────────────────────────────────

/**
 * Toggles a panel open or closed.
 * - Adds/removes .open on both the button and the panel.
 * - Updates aria-expanded on the button for accessibility.
 * - On open: stagger-animates each child item.
 * - On close: removes .visible from all items so they re-animate next open.
 *
 * @param {HTMLElement} btn    — The toggle button element.
 * @param {HTMLElement} panel  — The collapsible panel element.
 * @param {string}      openLabel  — Button label when panel is open.
 * @param {string}      closeLabel — Button label when panel is closed.
 */
function togglePanel(btn, panel, openLabel, closeLabel) {
  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    // ── CLOSE ──
    panel.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.querySelector('.btn-label').textContent = closeLabel;

    // Remove .visible from all items (resets for next open)
    panel.querySelectorAll('.contact-item').forEach(item => {
      item.classList.remove('visible');
    });

  } else {
    // ── OPEN ──
    panel.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.btn-label').textContent = openLabel;

    // Stagger each item's entrance animation
    const items = panel.querySelectorAll('.contact-item');
    items.forEach((item, index) => {
      setTimeout(() => item.classList.add('visible'), index * STAGGER_MS);
    });
  }
}

// Wire up Contact button
contactBtn.addEventListener('click', () => {
  togglePanel(contactBtn, contactPanel, 'Hide contact', 'Get in touch');
});

// Wire up Profiles button
socialBtn.addEventListener('click', () => {
  togglePanel(socialBtn, socialPanel, 'Hide profiles', 'View profiles');
});

// ─── 4 & 5. Clipboard Copy ───────────────────────────────────────────────────

/**
 * Copies the given text to the clipboard.
 * Uses the modern Clipboard API with a textarea fallback for older browsers.
 *
 * @param {string} text  — The text to copy.
 * @param {string} label — Human-readable label shown in the toast (e.g. "Email").
 */
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text)
    .then(() => showToast(label))
    .catch(() => {
      fallbackCopy(text, label);
    });
}

/**
 * Legacy clipboard copy using document.execCommand('copy').
 * @param {string} text
 * @param {string} label
 */
function fallbackCopy(text, label) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(label);
  } catch (e) {
    console.error('Clipboard copy failed:', e);
  }
  document.body.removeChild(ta);
}

// ─── 6. Toast Helper ─────────────────────────────────────────────────────────

/**
 * Shows the toast with a dynamic label, then hides it after TOAST_DURATION_MS.
 * @param {string} label — e.g. "Email", "Phone"
 */
function showToast(label) {
  toastText.textContent = `${label} copied to clipboard ✓`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), TOAST_DURATION_MS);
}

// ─── 7. Attach Copy Listeners to All Copyable Items ─────────────────────────

/**
 * Selects every element with [data-copy] and attaches:
 *  - click → copy
 *  - keydown (Enter / Space) → copy   (keyboard accessibility)
 *
 * data-copy  = the text to copy to clipboard
 * data-label = the label shown in the toast notification
 */
document.querySelectorAll('.copyable').forEach(item => {
  const text  = item.dataset.copy;
  const label = item.dataset.label || 'Value';

  item.addEventListener('click', () => copyToClipboard(text, label));

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyToClipboard(text, label);
    }
  });
});

// ─── Fix button inner HTML to include .btn-label span ────────────────────────
// This runs once on load to wrap the text node inside a span
// so togglePanel() can update just the label without destroying the arrow.

[
  { btn: contactBtn, label: 'Get in touch' },
  { btn: socialBtn,  label: 'View profiles' },
].forEach(({ btn, label }) => {
  btn.innerHTML =
    `<span class="btn-label">${label}</span>` +
    `<span class="btn-arrow" aria-hidden="true">→</span>`;
});


const themeBtn = document.getElementById("theme-toggle");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  const saved = localStorage.getItem("theme");
  if (saved) document.body.setAttribute("data-theme", saved);
}
