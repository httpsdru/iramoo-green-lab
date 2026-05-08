// ===============================
// HERO INTERACTION
// ===============================
 
const letters = document.querySelectorAll('.green-base a');
const base    = document.querySelector(".green-base");
const overlay = document.querySelector(".green-overlay");
 
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
// PAGES CMS — single JSON file
// ===============================
 
const CMS_FILE = "/content.json";
 
const pageKeys = {
  "grasslands-page": "grasslands",
  "research-page":   "research",
  "education-page":  "education",
  "engagement-page": "engagement",
  "nursery-page":    "nursery"
};
 
// Parse [link text](url) into real <a> tags
function parseLinks(text) {
  if (!text) return "";
  return text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}
 
function renderBlock(b) {
  if (b.type === "text") {
    return `<div class="cms-block cms-text"><p>${parseLinks(b.text)}</p></div>`;
  }
  if (b.type === "heading") {
    return `<div class="cms-block cms-heading"><h2>${parseLinks(b.text)}</h2></div>`;
  }
  if (b.type === "list") {
    const items = (b.text || "")
      .split(/\n|•/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const headerHTML = b.header ? `<p class="list-header">${parseLinks(b.header)}</p>` : "";
    return `
      <div class="cms-block cms-list">
        ${headerHTML}
        <ul>${items.map(item => `<li>${parseLinks(item)}</li>`).join("")}</ul>
      </div>`;
  }
  if (b.type === "image") {
    if (!b.image) return "";
    const alt = b.alt || "";
    return `
      <div class="cms-block cms-image">
        <img src="${b.image}" alt="${alt}" loading="lazy" />
      </div>`;
  }
  return "";
}
 
function buildPanel(blocks) {
  const segments = [];
  let colGroup = [];
 
  blocks.forEach(b => {
    const isFull = b.type === "intro" || b.type === "heading";
    if (isFull) {
      if (colGroup.length) {
        segments.push({ type: "columns", blocks: colGroup });
        colGroup = [];
      }
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
      if (b.type === "intro")   html += `<div class="cms-full cms-intro"><p>${parseLinks(b.text)}</p></div>`;
      if (b.type === "heading") html += `<div class="cms-full cms-heading"><h2>${parseLinks(b.text)}</h2></div>`;
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
 
// Show loading state in each panel
Object.keys(pageKeys).forEach(pageName => {
  const panel = document.querySelector(`[data-page="${pageName}"] .panel-content`);
  if (panel) panel.innerHTML = `<p style="opacity:0.4;font-size:0.9rem;">Loading…</p>`;
});
 
fetch(CMS_FILE)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    Object.entries(pageKeys).forEach(([pageName, key]) => {
      const panel = document.querySelector(`[data-page="${pageName}"] .panel-content`);
      if (!panel) return;
 
      const blocks = (data[key] && data[key].blocks) || [];
      panel.innerHTML = buildPanel(blocks);
 
      panel.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    });
  })
  .catch(err => {
    console.error("CMS load error:", err);
    document.querySelectorAll(".panel-content").forEach(panel => {
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
  const allPanels = [...panels];
  const idx = allPanels.indexOf(panel);
  const sliderTop = document.getElementById("contentSlider").offsetTop;
  const tabHeight = allPanels[0].querySelector(".panel-title").offsetHeight;
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
 