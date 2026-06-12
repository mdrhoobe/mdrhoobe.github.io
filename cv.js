/**
 * cv.js — Dynamic CV Generator
 * ─────────────────────────────
 * Generates a professional PDF entirely in the browser using jsPDF.
 * No server, no upload, no static file — PDF is built fresh on every click
 * from the CV_DATA object below.
 *
 * To update the CV: edit CV_DATA only. No other changes needed.
 *
 * Library: jsPDF 2.x  (loaded via CDN in index.html)
 * CDN: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
 */

// ═══════════════════════════════════════════════════════════════════════════
//  CV_DATA  — single source of truth for all CV content
//  Edit anything here and the PDF updates automatically on next download
// ═══════════════════════════════════════════════════════════════════════════
const CV_DATA = {

  // ── Personal info (some shown on site, some PDF-only) ──
  personal: {
    name:        'Mohammed Drhoobe',
    role:        'Full Stack Developer  ·  OSINT Researcher  ·  Cybersecurity Enthusiast',
    email:       'mdrhoobe@gmail.com',
    phone:       '+218 91 787 5051',
    location:    'Tripoli, Libya',
    // PDF-only fields (not shown on website)
    dob:         '16 February 1998',
    nationality: 'Libyan',
    github:      'github.com/mdrhoobe',
    linkedin:    'linkedin.com/in/mdrhoobe',
  },

  // ── Profile summary ──
  profile: `IT professional with experience in full-stack web
development, network infrastructure, and OSINT cyber investigation.
Currently serving as Technical Support Specialist at the Libyan Ministry
of Interior while building advanced web systems and open-source intelligence
tools. Committed to technological advancement and operational excellence.`,

  // ── Work experience ──
  experience: [
    {
      title:   'Technical Support Specialist',
      org:     'Communications Unit — Libyan Ministry of Interior',
      city:    'Tripoli',
      from:    'Jan 2015',
      to:      'Present',
      bullets: [
        'Rapid resolution of hardware, software, and network issues for staff.',
        'Diagnose device and network faults; implement timely, effective solutions.',
        'Execute system upgrades, patches, and security hardening across infrastructure.',
        'Coordinate with IT teams on complex incident resolution.',
      ],
    },
    {
      title:   'Network Technician',
      org:     'Rawafed Libya for Communications and Technology',
      city:    'Tripoli',
      from:    'Jan 2017',
      to:      'Jan 2018',
      bullets: [
        'Installed and configured network devices ensuring continuous connectivity.',
        'Troubleshot LAN/WAN infrastructure faults with rapid turnaround.',
        'Conducted network performance audits and capacity assessments.',
      ],
    },
  ],

  // ── Education ──
  education: [
    {
      degree: 'B.Sc. Information Technology (Programming)',
      org:    'Libyan University of Modern Sciences and Technology',
      city:   'Benghazi',
      from:   'Jan 2020',
      to:     'Aug 2025',
    },
    {
      degree: 'Higher Diploma in Information Technology',
      org:    'Ain Shams Higher Institute',
      city:   'Tripoli',
      from:   '',
      to:     'Completed',
    },
  ],

  // ── Courses & Certifications ──
  courses: [
    {
      title:   'OSINT Certified Practitioner',
      org:     'UNODC Regional Centre for Combatting Cybercrime',
      city:    'Doha, Qatar',
      date:    'Feb 2025',
      bullets: [
        'Open-source data analysis and extraction of actionable intelligence.',
        'Electronic threat detection using advanced OSINT methodologies.',
        'Digital forensics, cyber-trail investigation, and pattern analysis.',
      ],
    },
    {
      title:   'Full Stack Developer',
      org:     'IT SHEAR Training Centre',
      city:    '',
      date:    'Jan – Jun 2021',
      bullets: [
        'Frontend: HTML5, CSS3, JavaScript. Backend: Node.js.',
        'Database design: MongoDB and MySQL.',
        'Application security, performance optimisation, and deployment.',
      ],
    },
  ],

  // ── Skills ──
  skills: [
    { cat: 'Frontend',    detail: 'React, HTML5, CSS3, JavaScript' },
    { cat: 'Backend',     detail: 'Node.js, REST APIs' },
    { cat: 'Database',    detail: 'MongoDB, MySQL' },
    { cat: 'OSINT',       detail: 'Open-source intelligence tools & methodology' },
    { cat: 'Network',     detail: 'Setup, configuration & troubleshooting' },
    { cat: 'Security',    detail: 'Cybersecurity principles & data protection' },
    { cat: 'Systems',     detail: 'Linux, Bash scripting' },
    { cat: 'Support',     detail: 'Technical support & IT infrastructure' },
    { cat: 'Office',      detail: 'Microsoft Office Suite' },
    { cat: 'Soft Skills', detail: 'Teamwork · Fast learner · Works under pressure' },
  ],

  // ── Languages ──
  languages: [
    { name: 'Arabic',  level: 'Native' },
    { name: 'English', level: 'C1 — Advanced' },
  ],

  // ── Interests ──
  interests: ['Technical literature', 'Photography', 'Volunteer work', 'Programming'],
};

// ═══════════════════════════════════════════════════════════════════════════
//  PDF GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateCV() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // ── Dimensions ──
  const PW = 210;   // page width  mm
  const PH = 297;   // page height mm
  const SB = 68;    // sidebar width mm
  const MAIN_X = SB + 1;
  const MAIN_W = PW - SB - 8;

  // ── Colour palette (RGB arrays) ──
  const C = {
    dark:    [13,  13,  13],
    sidebar: [17,  17,  17],
    mainbg:  [248, 248, 248],
    accent:  [200, 241, 53],
    white:   [255, 255, 255],
    mid:     [80,  80,  80],
    muted:   [140, 140, 140],
    rule:    [42,  42,  42],
    text:    [30,  30,  30],
  };

  // ── State ──
  let y = 0;   // current Y cursor (main column)
  let sy = 0;  // current Y cursor (sidebar)

  // ── Helpers ──

  /** Set fill colour from RGB array */
  function fill(rgb) { doc.setFillColor(...rgb); }

  /** Set text colour from RGB array */
  function ink(rgb)  { doc.setTextColor(...rgb); }

  /** Set draw colour from RGB array */
  function stroke(rgb) { doc.setDrawColor(...rgb); }

  /** Draw filled rectangle */
  function rect(x, xw, yy, h, rgb) {
    fill(rgb);
    doc.rect(x, yy, xw, h, 'F');
  }

  /** Advance main cursor */
  function gap(h) { y += h; }

  /** Advance sidebar cursor */
  function sgap(h) { sy += h; }

  /**
   * Wrap and print text, returning new Y after last line.
   * @param {string} text
   * @param {number} x      left X
   * @param {number} yy     top Y
   * @param {number} maxW   max width before wrap
   * @param {number} size   font size
   * @param {string} style  'normal'|'bold'|'italic'
   * @param {number[]} color RGB
   * @returns {number} Y after last printed line
   */
  function text(str, x, yy, maxW, size, style, color, lineH) {
    doc.setFontSize(size);
    doc.setFont('helvetica', style || 'normal');
    ink(color || C.text);
    const lh = lineH || size * 0.45;
    const lines = doc.splitTextToSize(str, maxW);
    lines.forEach((line, i) => {
      doc.text(line, x, yy + i * lh);
    });
    return yy + lines.length * lh;
  }

  /**
   * Section heading with accent underline (main column).
   */
  function sectionHead(label) {
    gap(5);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    ink(C.text);
    // Simulate letter-spacing by spacing chars
    doc.text(label.toUpperCase(), MAIN_X, y);
    const tw = doc.getTextWidth(label.toUpperCase());
    stroke(C.accent);
    doc.setLineWidth(0.6);
    doc.line(MAIN_X, y + 0.8, MAIN_X + MAIN_W, y + 0.8);
    gap(5);
  }

  /**
   * Sidebar section heading.
   */
  function sbHead(label) {
    sgap(4);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    ink(C.accent);
    doc.text(label.toUpperCase(), 5, sy);
    doc.setLineWidth(0.4);
    stroke(C.rule);
    doc.line(5, sy + 0.8, SB - 5, sy + 0.8);
    sgap(4.5);
  }

  /**
   * Print a bullet point in main column.
   */
  function bullet(str) {
    const bx = MAIN_X + 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    ink(C.mid);
    doc.text('•', MAIN_X + 1, y);
    const lines = doc.splitTextToSize(str, MAIN_W - 5);
    lines.forEach((line, i) => {
      doc.text(line, bx, y + i * 4);
    });
    gap(lines.length * 4 + 0.5);
  }

  // ── Check / add page ──
  function checkPage(needed) {
    if (y + needed > PH - 10) {
      doc.addPage();
      // Re-draw backgrounds on new page
      rect(0, SB, 0, PH, C.sidebar);
      rect(SB, PW - SB, 0, PH, C.mainbg);
      // Accent divider line
      fill(C.accent);
      doc.rect(SB, 0, 1, PH, 'F');
      y = 10;
    }
  }

  // ═══════════════════════════════════════
  //  DRAW BACKGROUNDS
  // ═══════════════════════════════════════

  // Sidebar background
  rect(0, SB, 0, PH, C.sidebar);

  // Main background
  rect(SB, PW - SB, 0, PH, C.mainbg);

  // Header band (full width, darker)
  const HDR_H = 32;
  rect(0, PW, 0, HDR_H, C.dark);

  // Accent strip below header
  fill(C.accent);
  doc.rect(0, HDR_H, PW, 1.5, 'F');

  // Accent divider between sidebar and main
  fill(C.accent);
  doc.rect(SB, 0, 1, PH, 'F');

  // ═══════════════════════════════════════
  //  HEADER
  // ═══════════════════════════════════════
  const d = CV_DATA.personal;

  // Name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  ink(C.white);
  doc.text(d.name, 8, 14);

  // Role line
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  ink(C.accent);
  doc.text(d.role, 8, 21);

  // Contact inline in header (right side)
  doc.setFontSize(7.5);
  ink(C.muted);
  const hdrRight = PW - 8;
  doc.text(d.email,    hdrRight, 13, { align: 'right' });
  doc.text(d.phone,    hdrRight, 18, { align: 'right' });
  doc.text(d.location, hdrRight, 23, { align: 'right' });

  // ═══════════════════════════════════════
  //  SIDEBAR  (sy starts below header)
  // ═══════════════════════════════════════
  sy = HDR_H + 8;

  // Personal details
  sbHead('Personal');
  const personal_rows = [
    ['Date of Birth', d.dob],
    ['Nationality',   d.nationality],
    ['GitHub',        d.github],
    ['LinkedIn',      d.linkedin],
  ];
  personal_rows.forEach(([k, v]) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    ink(C.muted);
    doc.text(k, 5, sy);
    sgap(3.5);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    ink(C.white);
    const lines = doc.splitTextToSize(v, SB - 10);
    lines.forEach((l, i) => doc.text(l, 5, sy + i * 3.8));
    sgap(lines.length * 3.8 + 1);
  });

  // Languages
  sbHead('Languages');
  CV_DATA.languages.forEach(({ name, level }) => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    ink(C.white);
    doc.text(name, 5, sy);
    sgap(3.5);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    ink(C.accent);
    doc.text(level, 5, sy);
    sgap(4);
  });

  // Skills
  sbHead('Skills');
  CV_DATA.skills.forEach(({ cat, detail }) => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    ink(C.accent);
    doc.text(cat, 5, sy);
    sgap(3.5);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    ink(C.white);
    const lines = doc.splitTextToSize(detail, SB - 10);
    lines.forEach((l, i) => doc.text(l, 7, sy + i * 3.6));
    sgap(lines.length * 3.6 + 1.5);
  });

  // Interests
  sbHead('Interests');
  CV_DATA.interests.forEach(item => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    ink(C.white);
    doc.text(`· ${item}`, 5, sy);
    sgap(4);
  });

  // ═══════════════════════════════════════
  //  MAIN COLUMN  (y starts below header)
  // ═══════════════════════════════════════
  y = HDR_H + 8;

  // ── Profile ──
  sectionHead('Profile');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  ink(C.mid);
  const profileLines = doc.splitTextToSize(CV_DATA.profile.replace(/\n/g, ' '), MAIN_W);
  profileLines.forEach(l => { doc.text(l, MAIN_X, y); gap(4); });
  gap(3);

  // ── Experience ──
  sectionHead('Experience');
  CV_DATA.experience.forEach(job => {
    checkPage(20);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    ink(C.text);
    doc.text(job.title, MAIN_X, y);
    gap(4.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    ink(C.mid);
    doc.text(`${job.org}${job.city ? ', ' + job.city : ''}`, MAIN_X, y);
    gap(4);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    ink(C.muted);
    doc.text(`${job.from} — ${job.to}`, MAIN_X, y);
    gap(4.5);

    job.bullets.forEach(b => { checkPage(8); bullet(b); });
    gap(3);
  });

  // ── Education ──
  sectionHead('Education');
  CV_DATA.education.forEach(edu => {
    checkPage(16);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    ink(C.text);
    doc.text(edu.degree, MAIN_X, y);
    gap(4.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    ink(C.mid);
    doc.text(`${edu.org}${edu.city ? ', ' + edu.city : ''}`, MAIN_X, y);
    gap(4);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    ink(C.muted);
    const dateStr = edu.from ? `${edu.from} — ${edu.to}` : edu.to;
    doc.text(dateStr, MAIN_X, y);
    gap(5);
  });

  // ── Courses ──
  sectionHead('Courses & Certifications');
  CV_DATA.courses.forEach(crs => {
    checkPage(20);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    ink(C.text);
    doc.text(crs.title, MAIN_X, y);
    gap(4.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    ink(C.mid);
    doc.text(`${crs.org}${crs.city ? ', ' + crs.city : ''}`, MAIN_X, y);
    gap(4);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    ink(C.muted);
    doc.text(crs.date, MAIN_X, y);
    gap(4.5);

    crs.bullets.forEach(b => { checkPage(8); bullet(b); });
    gap(3);
  });

  // ── Save ──
  doc.save('Mohammed_Drhoobe_CV.pdf');
}

// ── Wire up button ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cvBtn = document.getElementById('cv-download-btn');
  if (!cvBtn) return;

  cvBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Loading state
    const label = cvBtn.querySelector('.cv-btn-label');
    const icon  = cvBtn.querySelector('.cv-btn-icon');
    const orig  = label.textContent;
    label.textContent = 'Generating...';
    cvBtn.style.pointerEvents = 'none';

    // Small delay so UI updates before heavy PDF work
    setTimeout(() => {
      try {
        generateCV();
        label.textContent = 'CV Generated ✓';
        cvBtn.style.borderColor = 'var(--accent)';
        setTimeout(() => {
          label.textContent = orig;
          cvBtn.style.pointerEvents = '';
          cvBtn.style.borderColor = '';
        }, 2500);
      } catch (err) {
        console.error('CV generation failed:', err);
        label.textContent = 'Error — try again';
        setTimeout(() => {
          label.textContent = orig;
          cvBtn.style.pointerEvents = '';
        }, 2000);
      }
    }, 50);
  });
});
