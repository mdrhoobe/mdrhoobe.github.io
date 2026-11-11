# Mohammed Ridha Mansour Salih — Portfolio

Static, responsive portfolio for professional introductions and university / scholarship applications.

**Live site:** https://mdrhoobe.github.io/  
**GitHub:** https://github.com/mdrhoobe

## Features

- Responsive, accessible dark/light interface built with HTML, CSS and vanilla JavaScript
- Keyboard navigation and a command palette (`/`, `Ctrl+K`)
- **On-demand English CV PDF creation** with a real browser download — no prebuilt PDF, CDN or external JavaScript dependency
- A4 two-column vector PDF with selectable/searchable text, working profile links, and automatic page breaks
- Arabic CV (`cv-ar.html`) using **Print / Save as PDF**, preserving right-to-left text shaping in the browser
- Reduced-motion and print styles
- No build system, package manager, cookies or server API required

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000/ and click **Download CV**. The browser generates a new English PDF and downloads it at that moment. No PDF exists in the repository. The result depends on the data in `cv-data.js` and reflects your latest edits after refresh.

You can also host the files on GitHub Pages. Place `index.html` and the other files directly at the **repository root**.

## Edit the CV

**Edit `cv-data.js`**. It contains the English CV data: name, subtitle, contact details, education, work history, certifications and skills.

- `cv-pdf.js` handles PDF creation and text wrapping, including automatic A4 page breaks.
- `cv.js` connects the download button to the generator and provides the language menu.
- `cv-ar.html` contains the separate Arabic, browser-printable CV. Update it separately for Arabic content changes.
- `index.html` has the public portfolio copy and metadata, which must also be kept accurate.

**Important:** All public portfolio content and CV details should match your verified documents and your current intent to disclose them. This repository is public; avoid including passport scans, certificates, identification numbers, secrets or confidential work details.

### File tree

```text
index.html       Portfolio page and metadata
style.css        Design, mobile, accessibility and print styling
script.js        Portfolio interactions
cv-data.js       Editable English CV content
cv-pdf.js        Local PDF generator (no library/CDN required)
cv.js            CV button and language selector
cv-ar.html       Arabic print/Save as PDF view
robots.txt       Crawling rules
sitemap.xml      Sitemap
README.md        This documentation
```

## PDF behavior and limits

- **English:** The browser creates a downloadable PDF Blob with standard embedded PDF instructions and built-in Helvetica fonts. It is not a saved PDF file, screenshot or image-based export. The generated text is searchable. If the CV grows, it starts a new page below a repeated header instead of drawing through the banner.
- **Arabic:** Select Arabic in the language menu to open `cv-ar.html`; press **تحميل PDF** and choose **Save as PDF** in the print dialog. This uses native Arabic shaping. It is not an automatic direct download.
- The lightweight English PDF generator supports **Latin/ASCII content only**. For non-Latin names or paragraphs, a real Unicode font and advanced shaping implementation would be required; this simple version replaces unsupported characters rather than falsely claiming multilingual PDF support.
- Refresh the page after modifying `cv-data.js` before generating a new PDF. There is no need for a Python script, a local build or an uploaded PDF asset.

## Verification performed (2026-11-11)

- JavaScript syntax checks passed.
- Chromium-based tests confirmed on-demand browser PDF downloads at desktop (1280px) and mobile (390px) viewport widths without JavaScript errors or horizontal overflow.
- Generated English CV was verified as **one A4 page** with searchable/selectable text, correct full name, degree information and two PDF links.
- Stress test extended a job with many extra bullets: the result became **two A4 pages**. Page two content began below the header, not on top of it.
- Test did not validate every possible browser or future CV edit; verify after major content changes.

## Scholarship portfolio guidance

Add only documented projects that you can defend in an interview. A strong project repository includes a problem statement, research method, reproduction steps, evaluation, realistic results, limitations and a security/ethics note where necessary. Scholarship submissions should also include the requested academic records through official portals, not inside this public repository.

Employment dates and the 2020 Higher Diploma year were confirmed by the portfolio owner. Confirm the passport-name spelling and the accuracy of every public contact/detail before submitting applications.

## License

No open-source license is included. Choose one only if you intend to grant the associated reuse rights. Public availability alone does not make the CV content available for unrestricted reuse.
