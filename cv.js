function buildPDF(themeId, langId) {
  const { jsPDF } = window.jspdf;

  if (!jsPDF) {
    console.error("jsPDF not loaded");
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const CV_THEMES = {
    dark: {
      mainBg: [255,255,255],
      mainTxt: [20,20,20],
      accent: [200,241,53],
      sidebar: [20,20,20],
      sidebarTxt: [255,255,255],
    },
    light: {
      mainBg: [255,255,255],
      mainTxt: [20,20,20],
      accent: [14,100,200],
      sidebar: [240,240,240],
      sidebarTxt: [30,30,30],
    }
  };

  const T = CV_THEMES[themeId] || CV_THEMES.dark;

  const data = {
    name: "Mohammed Salih",
    role: "Full Stack Developer · OSINT Researcher",
    email: "mdrhoobe@gmail.com",
    phone: "+218 91 787 5051"
  };

  const PW = 210;
  const SB = 60;

  function bg() {
    doc.setFillColor(...T.mainBg);
    doc.rect(0,0,PW,297,"F");

    doc.setFillColor(...T.sidebar);
    doc.rect(0,0,SB,297,"F");
  }

  bg();

  doc.setTextColor(...T.mainTxt);
  doc.setFontSize(18);
  doc.text(data.name, 70, 20);

  doc.setFontSize(10);
  doc.text(data.role, 70, 30);

  doc.setTextColor(...T.sidebarTxt);
  doc.text(data.email, 10, 40);
  doc.text(data.phone, 10, 50);

  doc.save("CV.pdf");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("cv-download-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    buildPDF("dark", "en");
  });
});
