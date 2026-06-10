7/**
 * cv.js — Dynamic CV Generator
 * يولّد PDF في المتصفح مباشرة — لا سيرفر، لا رفع ملفات
 * لتعديل أي معلومة: عدّل CV_DATA فقط
 */

const CV_DATA = {
  personal: {
    name:        'Mohammed Drhoobe',
    role:        'Full Stack Developer  ·  OSINT Researcher  ·  Cybersecurity Enthusiast',
    email:       'mdrhoobe@gmail.com',
    phone:       '+218 91 787 5051',
    location:    'Tripoli, Libya',
    dob:         '16 February 1998',
    nationality: 'Libyan',
    github:      'github.com/yourusername',
    linkedin:    'linkedin.com/in/yourusername',
  },
  profile: `IT professional with 10+ years of experience in full-stack web development, network infrastructure, and OSINT cyber investigation. Currently serving as Technical Support Specialist at the Libyan Ministry of Interior while building advanced web systems and open-source intelligence tools. Committed to technological advancement and operational excellence.`,
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
  languages: [
    { name: 'Arabic',  level: 'Native' },
    { name: 'English', level: 'C1 — Advanced' },
  ],
  interests: ['Technical literature', 'Photography', 'Volunteer work', 'Programming'],
};

function generateCV() {
  if (!window.jspdf){ 
    alert('PDF library not loaded. Please refresh the page and try again.');
    return;}
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297, SB = 68;
  const MAIN_X = SB + 1, MAIN_W = PW - SB - 8;
  const C = {
    dark:   [13,13,13], sidebar:[17,17,17], mainbg:[248,248,248],
    accent: [200,241,53], white:[255,255,255], mid:[80,80,80],
    muted:  [140,140,140], rule:[42,42,42], text:[30,30,30],
  };
  let y = 0, sy = 0;
  const fill   = rgb => doc.setFillColor(...rgb);
  const ink    = rgb => doc.setTextColor(...rgb);
  const stroke = rgb => doc.setDrawColor(...rgb);
  const rect   = (x,w,yy,h,rgb) => { fill(rgb); doc.rect(x,yy,w,h,'F'); };
  const gap    = h => { y += h; };
  const sgap   = h => { sy += h; };

  function sectionHead(label) {
    gap(5);
    doc.setFontSize(7.5); doc.setFont('helvetica','bold'); ink(C.text);
    doc.text(label.toUpperCase(), MAIN_X, y);
    stroke(C.accent); doc.setLineWidth(0.6);
    doc.line(MAIN_X, y+0.8, MAIN_X+MAIN_W, y+0.8);
    gap(5);
  }
  function sbHead(label) {
    sgap(4);
    doc.setFontSize(7); doc.setFont('helvetica','bold'); ink(C.accent);
    doc.text(label.toUpperCase(), 5, sy);
    doc.setLineWidth(0.4); stroke(C.rule);
    doc.line(5, sy+0.8, SB-5, sy+0.8);
    sgap(4.5);
  }
  function bullet(str) {
    doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.mid);
    doc.text('•', MAIN_X+1, y);
    const lines = doc.splitTextToSize(str, MAIN_W-5);
    lines.forEach((l,i) => doc.text(l, MAIN_X+4, y+i*4));
    gap(lines.length*4+0.5);
  }
  function checkPage(n) {
    if (y+n > PH-10) {
      doc.addPage();
      rect(0,SB,0,PH,C.sidebar); rect(SB,PW-SB,0,PH,C.mainbg);
      fill(C.accent); doc.rect(SB,0,1,PH,'F');
      y = 10;
    }
  }

  // Backgrounds
  rect(0,SB,0,PH,C.sidebar); rect(SB,PW-SB,0,PH,C.mainbg);
  const HDR_H = 32;
  rect(0,PW,0,HDR_H,C.dark);
  fill(C.accent); doc.rect(0,HDR_H,PW,1.5,'F');
  fill(C.accent); doc.rect(SB,0,1,PH,'F');

  // Header
  const d = CV_DATA.personal;
  doc.setFontSize(22); doc.setFont('helvetica','bold'); ink(C.white);
  doc.text(d.name, 8, 14);
  doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.accent);
  doc.text(d.role, 8, 21);
  doc.setFontSize(7.5); ink(C.muted);
  const R = PW-8;
  doc.text(d.email, R, 13, {align:'right'});
  doc.text(d.phone, R, 18, {align:'right'});
  doc.text(d.location, R, 23, {align:'right'});

  // Sidebar
  sy = HDR_H+8;
  sbHead('Personal');
  [['Date of Birth',d.dob],['Nationality',d.nationality],['GitHub',d.github],['LinkedIn',d.linkedin]]
    .forEach(([k,v]) => {
      doc.setFontSize(7); doc.setFont('helvetica','bold'); ink(C.muted); doc.text(k,5,sy); sgap(3.5);
      doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.white);
      const ls = doc.splitTextToSize(v, SB-10);
      ls.forEach((l,i) => doc.text(l,5,sy+i*3.8)); sgap(ls.length*3.8+1);
    });
  sbHead('Languages');
  CV_DATA.languages.forEach(({name,level}) => {
    doc.setFontSize(8.5); doc.setFont('helvetica','bold'); ink(C.white); doc.text(name,5,sy); sgap(3.5);
    doc.setFontSize(7.5); doc.setFont('helvetica','normal'); ink(C.accent); doc.text(level,5,sy); sgap(4);
  });
  sbHead('Skills');
  CV_DATA.skills.forEach(({cat,detail}) => {
    doc.setFontSize(7.5); doc.setFont('helvetica','bold'); ink(C.accent); doc.text(cat,5,sy); sgap(3.5);
    doc.setFontSize(7.5); doc.setFont('helvetica','normal'); ink(C.white);
    const ls = doc.splitTextToSize(detail, SB-10);
    ls.forEach((l,i) => doc.text(l,7,sy+i*3.6)); sgap(ls.length*3.6+1.5);
  });
  sbHead('Interests');
  CV_DATA.interests.forEach(item => {
    doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.white);
    doc.text(`· ${item}`,5,sy); sgap(4);
  });

  // Main
  y = HDR_H+8;
  sectionHead('Profile');
  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); ink(C.mid);
  doc.splitTextToSize(CV_DATA.profile.replace(/\n/g,' '), MAIN_W)
     .forEach(l => { doc.text(l,MAIN_X,y); gap(4); });
  gap(3);

  sectionHead('Experience');
  CV_DATA.experience.forEach(job => {
    checkPage(20);
    doc.setFontSize(9.5); doc.setFont('helvetica','bold'); ink(C.text);
    doc.text(job.title, MAIN_X, y); gap(4.5);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.mid);
    doc.text(`${job.org}${job.city?', '+job.city:''}`, MAIN_X, y); gap(4);
    doc.setFontSize(7.5); doc.setFont('helvetica','italic'); ink(C.muted);
    doc.text(`${job.from} — ${job.to}`, MAIN_X, y); gap(4.5);
    job.bullets.forEach(b => { checkPage(8); bullet(b); }); gap(3);
  });

  sectionHead('Education');
  CV_DATA.education.forEach(edu => {
    checkPage(16);
    doc.setFontSize(9.5); doc.setFont('helvetica','bold'); ink(C.text);
    doc.text(edu.degree, MAIN_X, y); gap(4.5);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.mid);
    doc.text(`${edu.org}${edu.city?', '+edu.city:''}`, MAIN_X, y); gap(4);
    doc.setFontSize(7.5); doc.setFont('helvetica','italic'); ink(C.muted);
    doc.text(edu.from?`${edu.from} — ${edu.to}`:edu.to, MAIN_X, y); gap(5);
  });

  sectionHead('Courses & Certifications');
  CV_DATA.courses.forEach(crs => {
    checkPage(20);
    doc.setFontSize(9.5); doc.setFont('helvetica','bold'); ink(C.text);
    doc.text(crs.title, MAIN_X, y); gap(4.5);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); ink(C.mid);
    doc.text(`${crs.org}${crs.city?', '+crs.city:''}`, MAIN_X, y); gap(4);
    doc.setFontSize(7.5); doc.setFont('helvetica','italic'); ink(C.muted);
    doc.text(crs.date, MAIN_X, y); gap(4.5);
    crs.bullets.forEach(b => { checkPage(8); bullet(b); }); gap(3);
  });

  doc.save('Mohammed_Drhoobe_CV.pdf');
}

