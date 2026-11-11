/*
 * Small, dependency-free PDF generator for this English-language CV.
 * Generates a text-searchable A4 PDF on click; nothing is pre-rendered.
 * PDF 1.4, core Helvetica fonts, standard ASCII text and link annotations.
 * Arabic is intentionally handled by cv-ar.html + browser print (RTL shaping).
 */
(function (global) {
  'use strict';
  var WIDTH = 595.28, HEIGHT = 841.89, HEADER = 113, TOP = 133, BOTTOM = 45;
  var SIDE_X = 36, SIDE_W = 179, MAIN_X = 242, MAIN_W = WIDTH - MAIN_X - 36;
  var COLOR = {
    dark: [0.09, 0.105, 0.118], ink: [0.133, 0.153, 0.169],
    mid: [0.329, 0.357, 0.376], muted: [0.45, 0.48, 0.5],
    accent: [0.706, 0.882, 0.259], pale: [0.969, 0.976, 0.965],
    border: [0.87, 0.89, 0.87], white: [1, 1, 1]
  };
  var measurementCanvas = document.createElement('canvas');
  var metrics = measurementCanvas.getContext('2d');
  function n(v) { return Number(v.toFixed(2)); }
  function rgb(c) { return c.map(function (v) { return n(v); }).join(' '); }
  function plain(s) {
    return String(s == null ? '' : s)
      .replace(/[\u2010-\u2015\u2212]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/\u00a0/g, ' ').replace(/[^\x20-\x7e]/g, '?');
  }
  function literal(s) { return '(' + plain(s).replace(/([\\()])/g, '\\$1') + ')'; }
  function tw(text, size, bold) {
    metrics.font = (bold ? 'bold ' : '') + size + 'px Arial';
    return metrics.measureText(plain(text)).width;
  }
  function wrap(text, width, size, bold) {
    var words = plain(text).trim().split(/\s+/);
    if (!words[0]) return [''];
    var lines = [], line = '';
    // 4pt safety margin accounts for small Helvetica/Arial metric differences.
    var limit = width - 4;
    words.forEach(function (word) {
      var candidate = line ? line + ' ' + word : word;
      if (tw(candidate, size, bold) <= limit) { line = candidate; return; }
      if (line) { lines.push(line); line = ''; }
      if (tw(word, size, bold) <= limit) { line = word; return; }
      // Allow unusually long URLs/words without clipping outside the column.
      var fragment = '';
      Array.prototype.forEach.call(word, function (ch) {
        if (fragment && tw(fragment + ch, size, bold) > limit) {
          lines.push(fragment); fragment = '';
        }
        fragment += ch;
      });
      line = fragment;
    });
    if (line) lines.push(line);
    return lines;
  }

  function Document(profile) {
    this.profile = profile;
    this.pages = [];
    this.notes = [];
    this.current = {side: {page: 0, y: TOP}, main: {page: 0, y: TOP}};
    this.ensurePage(0);
  }
  Document.prototype.ensurePage = function (index) {
    while (this.pages.length <= index) {
      var page = {ops: [], links: []};
      this.pages.push(page);
      this.decorations(page, this.pages.length);
    }
    return this.pages[index];
  };
  Document.prototype.rect = function (page, x, y, w, h, fill) {
    page.ops.push(rgb(fill) + ' rg ' + [n(x), n(HEIGHT-y-h), n(w), n(h)].join(' ') + ' re f');
  };
  Document.prototype.stroke = function (page, x1, y1, x2, y2, color, width) {
    page.ops.push(rgb(color) + ' RG ' + n(width || 0.6) + ' w ' +
      n(x1) + ' ' + n(HEIGHT-y1) + ' m ' + n(x2) + ' ' + n(HEIGHT-y2) + ' l S');
  };
  Document.prototype.text = function (page, value, x, y, size, bold, color) {
    page.ops.push('BT /' + (bold ? 'F2' : 'F1') + ' ' + n(size) +
      ' Tf ' + rgb(color || COLOR.ink) + ' rg 1 0 0 1 ' + n(x) +
      ' ' + n(HEIGHT-y-size) + ' Tm ' + literal(value) + ' Tj ET');
  };
  Document.prototype.decorations = function (page, pageNumber) {
    var p = this.profile;
    this.rect(page, 0, 0, WIDTH, 108, COLOR.dark);
    this.rect(page, 0, 108, WIDTH, 5, COLOR.accent);
    this.rect(page, 0, 113, 227, HEIGHT - 113, COLOR.pale);
    this.stroke(page, 226.5, 113, 226.5, HEIGHT - 28, COLOR.border, 0.7);
    this.text(page, p.name, 36, 20, 23, true, COLOR.white);
    this.text(page, p.subtitle, 36, 50, 10, false, COLOR.accent);
    this.text(page, p.location + '   |   ' + p.phone + '   |   ' + p.email, 36, 70, 8.4, false, [0.84, 0.87, 0.86]);
    this.text(page, p.github + '   |   ' + p.linkedin, 36, 88, 8.4, false, [0.84, 0.87, 0.86]);
    this.stroke(page, 36, HEIGHT-29, WIDTH-36, HEIGHT-29, COLOR.border, 0.5);
    this.text(page, 'Curriculum Vitae  |  ' + pageNumber + ' / TOTAL', WIDTH-124, HEIGHT-25, 7, false, COLOR.muted);
    page.links.push({url: 'https://' + p.github, x: 36, y: 88, w: 137, h: 13});
    page.links.push({url: 'https://' + p.linkedin, x: 182, y: 88, w: 290, h: 13});
  };
  Document.prototype.room = function (col, size) {
    var cur = this.current[col];
    if (cur.y + size > HEIGHT - BOTTOM) {
      cur.page += 1;
      cur.y = TOP;
      this.ensurePage(cur.page);
    }
    return this.pages[cur.page];
  };
  Document.prototype.heading = function (col, label) {
    var cur = this.current[col], side = col === 'side';
    var page = this.room(col, 36), x = side ? SIDE_X : MAIN_X;
    var width = side ? SIDE_W : MAIN_W;
    this.rect(page, x, cur.y, 3, 11, COLOR.accent);
    this.text(page, plain(label).toUpperCase(), x + 10, cur.y-1, side ? 9 : 10, true);
    this.stroke(page, x+10, cur.y+16, x+width, cur.y+16, COLOR.border, 0.55);
    cur.y += 28;
  };
  Document.prototype.paragraph = function (col, text, style, after) {
    var cur = this.current[col], side = col === 'side';
    var styles = {
      body: [9.5, 13.7, false, COLOR.ink],
      muted: [8.7, 11.9, false, COLOR.mid],
      title: [10.2, 13.6, true, COLOR.ink],
      side: [8.7, 12, false, COLOR.ink],
      sideMuted: [8.25, 11.3, false, COLOR.mid],
      sideTitle: [9.0, 12.3, true, COLOR.ink]
    };
    var st = styles[style] || styles.body;
    var x = side ? SIDE_X : MAIN_X, width = side ? SIDE_W : MAIN_W;
    var lines = wrap(text, width, st[0], st[2]);
    var blockHeight = lines.length * st[1] + (after || 0);
    var page = this.room(col, blockHeight);
    lines.forEach(function (line) {
      this.text(page, line, x, cur.y, st[0], st[2], st[3]);
      cur.y += st[1];
    }, this);
    cur.y += after || 0;
  };
  Document.prototype.bullet = function (col, text, after) {
    var cur = this.current[col], side = col === 'side', x = side ? SIDE_X : MAIN_X;
    var width = side ? SIDE_W : MAIN_W;
    var size = side ? 8.2 : 9.2, leading = side ? 11.2 : 13.1;
    var lines = wrap(text, width-12, size, false);
    var page = this.room(col, lines.length * leading + (after || 0));
    this.rect(page, x+1, cur.y+5.0, 3, 3, side ? COLOR.muted : COLOR.accent);
    lines.forEach(function (line) {
      this.text(page, line, x+11, cur.y, size, false, side ? COLOR.mid : COLOR.ink);
      cur.y += leading;
    }, this);
    cur.y += after || 0;
  };
  Document.prototype.job = function (job) {
    this.paragraph('main', job.title, 'title', 2);
    this.paragraph('main', job.company + '  |  ' + job.dates, 'muted', 6);
    var self = this;
    job.points.forEach(function (v) { self.bullet('main', v, 4.4); });
    this.current.main.y += 10;
  };
  Document.prototype.populate = function () {
    var p = this.profile, self = this;
    this.heading('side', 'Education');
    p.education.forEach(function (v) {
      self.paragraph('side', v.title, 'sideTitle', 2);
      self.paragraph('side', v.institution, 'sideMuted', 2);
      self.paragraph('side', v.date, 'sideMuted', 9);
    });
    this.heading('side', 'Courses & certifications');
    p.certifications.forEach(function (v) {
      self.paragraph('side', v.title, 'sideTitle', 2);
      self.paragraph('side', v.institution + (v.title === 'Full Stack Developer' ? '  |  ' + v.date : ''), 'sideMuted', 2);
      if (v.title !== 'Full Stack Developer') self.paragraph('side', v.date, 'sideMuted', 4);
      v.points.forEach(function (b) { self.bullet('side', b, 4); });
      self.current.side.y += 4;
    });
    this.heading('side', 'Languages & interests');
    p.languages.forEach(function (l) { self.paragraph('side', l, 'side', 0); });
    this.current.side.y += 6;
    this.paragraph('side', p.interests.join('  |  '), 'sideMuted', 2);

    this.heading('main', 'Professional profile');
    this.paragraph('main', p.summary, 'body', 14);
    this.heading('main', 'Professional experience');
    p.experience.forEach(function (v) { self.job(v); });
    this.heading('main', 'Technical skills');
    p.skills.forEach(function (pair) { self.paragraph('main', pair[0] + ':  ' + pair[1], 'muted', 1.4); });
  };
  function pdfBytes(document) {
    var objects = [null];
    function add(s) { objects.push(s); return objects.length - 1; }
    function set(i,s) { objects[i] = s; }
    var fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    var fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    var pagesRoot = add('');
    var catalog = add('<< /Type /Catalog /Pages ' + pagesRoot + ' 0 R >>');
    var info = add('<< /Title ' + literal(document.profile.name + ' | Curriculum Vitae') +
      ' /Author ' + literal(document.profile.name) +
      ' /Creator (Client-side Portfolio CV Generator) >>');
    var kids = [];
    document.pages.forEach(function (page, i) {
      // The page count is inserted only into this page's footer content.
      var ops = page.ops.join('\n').replace('' + (i+1) + ' / TOTAL', '' + (i+1) + ' / ' + document.pages.length);
      var stream = add('<< /Length ' + ops.length + ' >>\nstream\n' + ops + '\nendstream');
      var linkRefs = page.links.map(function (l) {
        var x1 = n(l.x), y1 = n(HEIGHT-l.y-l.h), x2 = n(l.x+l.w), y2 = n(HEIGHT-l.y);
        return add('<< /Type /Annot /Subtype /Link /Rect [' + [x1,y1,x2,y2].join(' ') +
          '] /Border [0 0 0] /A << /S /URI /URI ' + literal(l.url) + ' >> >>');
      });
      var pageObj = add('<< /Type /Page /Parent ' + pagesRoot + ' 0 R /MediaBox [0 0 ' +
        WIDTH + ' ' + HEIGHT + '] /Resources << /Font << /F1 ' + fontRegular +
        ' 0 R /F2 ' + fontBold + ' 0 R >> >> /Contents ' + stream +
        ' 0 R /Annots [' + linkRefs.map(function (r) { return r + ' 0 R'; }).join(' ') + '] >>');
      kids.push(pageObj + ' 0 R');
    });
    set(pagesRoot, '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + document.pages.length + ' >>');
    var bytes = '%PDF-1.4\n%CV-PDF\n', offsets = [0];
    for (var i=1; i<objects.length; i++) {
      offsets.push(bytes.length);
      bytes += i + ' 0 obj\n' + objects[i] + '\nendobj\n';
    }
    var startXref = bytes.length;
    bytes += 'xref\n0 ' + objects.length + '\n0000000000 65535 f \n';
    for (var k=1; k<offsets.length; k++) bytes += String(offsets[k]).padStart(10,'0') + ' 00000 n \n';
    bytes += 'trailer\n<< /Size ' + objects.length + ' /Root ' + catalog + ' 0 R /Info ' + info +
      ' 0 R >>\nstartxref\n' + startXref + '\n%%EOF\n';
    return new TextEncoder().encode(bytes);
  }
  function build(profile) {
    if (!profile || !profile.name || !profile.education || !profile.experience) throw Error('Incomplete CV data');
    var doc = new Document(profile);
    doc.populate();
    return pdfBytes(doc);
  }
  function download(profile) {
    var bytes = build(profile);
    var objectUrl = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
    var a = document.createElement('a');
    a.href = objectUrl;
    a.download = profile.outputName || 'Curriculum_Vitae.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 60000);
    return bytes.length;
  }
  global.CvPdfGenerator = {build:build, download:download};
})(window);
