// ===============================
// HERO INTERACTION
// ===============================
 
const letters = document.querySelectorAll('.green-base a');
const base     = document.querySelector(".green-base");
const overlay  = document.querySelector(".green-overlay");
 
let activeLink = null;
const isMobile = window.matchMedia("(hover: none)").matches;
 
letters.forEach(link => {
  const word = link.dataset.word;
 
  if (!isMobile) {
    link.addEventListener("mouseenter", () => {
      overlay.textContent = word;
      base.style.opacity = "0";
      overlay.style.opacity = "1";
      overlay.style.transform = "translateX(-50%) translateY(0px)";
    });
    link.addEventListener("mouseleave", () => {
      base.style.opacity = "1";
      overlay.style.opacity = "0";
      overlay.style.transform = "translateX(-50%) translateY(10px)";
    });
  }
 
  if (isMobile) {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
 
      if (activeLink !== this) {
        activeLink = this;
        overlay.textContent = word;
        base.style.opacity = "0";
        overlay.style.opacity = "1";
        overlay.style.transform = "translateX(-50%) translateY(0px)";
      } else {
        activeLink = null;
        resetOverlay();
        const target = this.getAttribute("href").replace("#","") + "-page";
        const slider = document.getElementById("contentSlider");
        slider.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => { openPanel(target); }, 400);
      }
    });
  }
});
 
// Tap on the overlay word → navigate
if (isMobile) {
  overlay.addEventListener("click", function(e) {
    e.stopPropagation();
    if (!activeLink) return;
    const target = activeLink.getAttribute("href").replace("#","") + "-page";
    activeLink = null;
    resetOverlay();
    const slider = document.getElementById("contentSlider");
    slider.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { openPanel(target); }, 400);
  });
 
  document.addEventListener("click", function() {
    if (activeLink) {
      activeLink = null;
      resetOverlay();
    }
  });
}
 
function resetOverlay() {
  base.style.opacity = "1";
  overlay.style.opacity = "0";
  overlay.style.transform = "translateX(-50%) translateY(10px)";
}
 
 
// ===============================
// HERO → OPEN PANEL (desktop)
// ===============================
 
document.querySelectorAll('.green-base a').forEach(link => {
  if (isMobile) return;
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute("href").replace("#","") + "-page";
    const slider = document.getElementById("contentSlider");
    slider.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { openPanel(target); }, 400);
  });
});
 
 
// ===============================
// NAV BUTTONS
// ===============================
 
document.getElementById("homeBtn")?.addEventListener("click", e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
 
document.getElementById("aboutBtn")?.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector(".intro-text")?.scrollIntoView({ behavior: "smooth" });
});
 
document.getElementById("contactBtn")?.addEventListener("click", e => {
  e.preventDefault();
  document.querySelector(".site-footer")?.scrollIntoView({ behavior: "smooth" });
});
 
document.getElementById("greenLabLogoBtn")?.addEventListener("click", e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
 
 
// ===============================
// NAV + CONTACT COLOUR
// ===============================
 
const header     = document.querySelector("header");
const contactBtn = document.getElementById("contactBtn");
const lightSections = document.querySelectorAll(".enko-slider, .site-footer");
 
function updateColours() {
  const winH = window.innerHeight;
 
  const headerLight = [...lightSections].some(el => {
    const r = el.getBoundingClientRect();
    return r.top < 80 && r.bottom > 0;
  });
  header.classList.toggle("dark", headerLight);
 
  const contactLight = [...lightSections].some(el => {
    const r = el.getBoundingClientRect();
    return r.top < winH && r.bottom > winH - 60;
  });
  contactBtn?.classList.toggle("dark", contactLight);
}
 
window.addEventListener("scroll", updateColours, { passive: true });
window.addEventListener("resize", updateColours, { passive: true });
window.addEventListener("load", updateColours);
 
 
// ===============================
// GOOGLE SHEETS CMS
// ===============================
 
const SHEET_BASE =
  "https://docs.google.com/spreadsheets/d/1fm9eqTf06dpschr5B3eYyqqJowX3bnzKHsCabgP8xGM/export?format=csv&gid=";
 
const pages = {
  "grasslands-page":  "289528533",
  "research-page":    "1744533134",
  "education-page":   "215026697",
  "engagement-page":  "300892158",
  "nursery-page":     "1392614358"
};
 
function parseCSV(text) {
  const rows  = [];
  let row     = [];
  let field   = "";
  let inQuote = false;
 
  for (let i = 0; i < text.length; i++) {
    const ch   = text[i];
    const next = text[i + 1];
 
    if (inQuote) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuote = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { row.push(field.trim()); field = ""; }
      else if (ch === '\n') {
        row.push(field.trim());
        field = "";
        if (row.some(c => c !== "")) rows.push(row);
        row = [];
      }
      else if (ch === '\r') { /* ignore */ }
      else { field += ch; }
    }
  }
 
  row.push(field.trim());
  if (row.some(c => c !== "")) rows.push(row);
  return rows.slice(1);
}
 
function getBlock(cols) {
  return {
    layout: (cols[1] || "").trim().toLowerCase(),
    text:   (cols[3] || "").trim(),
    header: (cols[4] || "").trim(),
    img:    (cols[5] || "").trim(),
  };
}
 
function renderBlock(b) {
  if (b.layout === "text") {
    return `<div class="cms-block cms-text"><p>${b.text}</p></div>`;
  }
  if (b.layout === "heading") {
    return `<div class="cms-block cms-heading"><h2>${b.text}</h2></div>`;
  }
  if (b.layout === "list") {
    const items = b.text
      .split(/\n|•/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const headerHTML = b.header ? `<p class="list-header">${b.header}</p>` : "";
    return `
      <div class="cms-block cms-list">
        ${headerHTML}
        <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
      </div>`;
  }
  if (b.layout === "image") {
    if (!b.img) return "";
    return `
      <div class="cms-block cms-image">
        <img src="${b.img}" alt="" loading="lazy" />
      </div>`;
  }
  return "";
}
 
function buildPanel(rows) {
  const blocks = rows.map(getBlock).filter(b => b.layout !== "");
  const segments = [];
  let colGroup = [];
 
  blocks.forEach(b => {
    const isFull = b.layout === "intro" || b.layout === "heading";
    if (isFull) {
      if (colGroup.length) { segments.push({ type: "columns", blocks: colGroup }); colGroup = []; }
      segments.push({ type: "full", block: b });
    } else {
      colGroup.push(b);
    }
  });
 
  if (colGroup.length) segments.push({ type: "columns", blocks: colGroup });
 
  let html = "";
 
  segments.forEach(seg => {
    if (seg.type === "full") {
      const b = seg.block;
      if (b.layout === "intro")   html += `<div class="cms-full cms-intro"><p>${b.text}</p></div>`;
      if (b.layout === "heading") html += `<div class="cms-full cms-heading"><h2>${b.text}</h2></div>`;
      return;
    }
    const all   = seg.blocks;
    const split = Math.ceil(all.length / 2);
    html += `
      <div class="cms-columns">
        <div class="cms-col">${all.slice(0, split).map(renderBlock).join("")}</div>
        <div class="cms-col">${all.slice(split).map(renderBlock).join("")}</div>
      </div>`;
  });
 
  return html;
}
 
Object.entries(pages).forEach(([pageName, gid]) => {
  const panel = document.querySelector(`[data-page="${pageName}"] .panel-content`);
  if (!panel) return;
 
  panel.innerHTML = `<p style="opacity:0.4;font-size:0.9rem;">Loading…</p>`;
 
  fetch(SHEET_BASE + gid)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(csv => {
      const rows = parseCSV(csv);
      panel.innerHTML = buildPanel(rows);
      panel.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    })
    .catch(err => {
      console.error(`Sheet error [${pageName}]:`, err);
      panel.innerHTML = `<p style="opacity:0.5;">Content unavailable.</p>`;
    });
});
 
 
// ===============================
// PANEL SYSTEM
// ===============================
 
const panels = document.querySelectorAll(".panel");
 
// Get the top of the slider section (above all panels)
// then add each collapsed panel's height to reach the right panel
function scrollToPanel(panel) {
  // Collect all panels in order
  const allPanels = [...panels];
  const idx = allPanels.indexOf(panel);
  // Get the slider's top position (stable — never changes)
  const sliderTop = document.getElementById("contentSlider").offsetTop;
  // Each collapsed tab height — read from first panel's actual height
  const tabHeight = allPanels[0].querySelector(".panel-title").offsetHeight;
  // Target = slider top + (number of tabs above this panel × tab height)
  const scrollTarget = sliderTop + (idx * tabHeight) - 62;
  window.scrollTo({ top: scrollTarget, behavior: "smooth" });
}
 
function openPanel(page) {
  panels.forEach(p => p.classList.remove("active"));
  const target = document.querySelector(`[data-page="${page}"]`);
  if (!target) return;
  target.classList.add("active");
  if (window.innerWidth <= 768) {
    scrollToPanel(target);
  }
}
 
document.querySelectorAll(".panel-title").forEach(title => {
  title.addEventListener("click", () => {
    const panel = title.closest(".panel");
    if (window.innerWidth <= 768) {
      const isActive = panel.classList.contains("active");
      panels.forEach(p => p.classList.remove("active"));
      if (!isActive) {
        panel.classList.add("active");
        scrollToPanel(panel);
      }
    } else {
      panels.forEach(p => p.classList.remove("active"));
      panel.classList.add("active");
    }
  });
});
 
// Hover to open — desktop only
document.querySelectorAll(".panel").forEach(panel => {
  panel.addEventListener("mouseenter", () => {
    if (window.innerWidth <= 768) return;
    panels.forEach(p => p.classList.remove("active"));
    panel.classList.add("active");
  });
});
 
 
// ===============================
// LOAD
// ===============================
 
window.addEventListener("load", () => {
 
  // Desktop only — mobile panels start collapsed
  if (window.innerWidth > 768) {
    openPanel("grasslands-page");
  }
 
  const loader   = document.getElementById("loader");
  const popup    = document.getElementById("acknowledgement-popup");
  const enterBtn = document.getElementById("ack-enter");
 
  popup?.classList.add("show");
 
  enterBtn?.addEventListener("click", () => {
    popup.classList.remove("show");
    setTimeout(() => {
      loader?.classList.add("hide");
    }, 300);
  });
 
});
 
 
// ===============================
// CUSTOM CURSOR
// ===============================
 
const cursor = document.getElementById("custom-cursor");
 
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top  = e.clientY + "px";
});
 
document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
document.addEventListener("mouseup",   () => cursor.classList.remove("clicking"));
 
document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
 
// Delegation — catches static AND dynamically loaded CMS content
document.addEventListener("mouseover", e => {
  if (e.target.closest("a, button, .panel-title, #ack-enter")) {
    cursor.classList.add("hovering");
  } else {
    cursor.classList.remove("hovering");
  }
});