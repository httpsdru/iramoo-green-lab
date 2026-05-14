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
// PAGES CMS — separate JSON files
// ===============================
 
const CMS_FILES = {
  acknowledgement: "/content/acknowledgement.json",
  about:           "/content/about.json",
  contact:         "/content/contact.json",
  grasslands:      "/content/grasslands.json",
  research:        "/content/research.json",
  education:       "/content/education.json",
  engagement:      "/content/engagement.json",
  nursery:         "/content/nursery.json"
};
 
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
 
// Wrap each letter of an element's text in a span so it can animate.
// Preserves <a> tags and other inline elements — only wraps text nodes.
// Accepts a single element or a list of elements.
function wrapLettersIn(target, stagger = 0.18) {
  const list = target.length !== undefined ? [...target] : [target];
 
  list.forEach(el => {
    if (!el || el.dataset.lettersWrapped === "true") return;
 
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);
 
    let letterIndex = 0;
    textNodes.forEach(textNode => {
      const fragment = document.createDocumentFragment();
      [...textNode.textContent].forEach(ch => {
        if (ch === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'letter-wave';
          span.style.animationDelay = (letterIndex * stagger) + 's';
          span.textContent = ch;
          fragment.appendChild(span);
          letterIndex++;
        }
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });
 
    el.dataset.lettersWrapped = "true";
  });
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
    const caption = b.caption || "";
    const captionHTML = caption ? `<p class="cms-caption">${parseLinks(caption)}</p>` : "";
    return `
      <div class="cms-block cms-image">
        <img src="${b.image}" alt="${caption.replace(/"/g, '&quot;')}" loading="lazy" />
        ${captionHTML}
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
 
// ----- Site-wide content injection -----
 
function applyAcknowledgement(ack) {
  if (!ack) return;
  const labelEl   = document.querySelector('.ack-label');
  const bodyEl    = document.querySelector('.ack-body');
  const btnEl     = document.getElementById('ack-enter');
  const imgEl     = document.querySelector('.ack-artwork img');
  const captionEl = document.querySelector('.ack-caption');
 
  if (labelEl   && ack.label)       labelEl.textContent = ack.label;
  if (bodyEl    && ack.body)        bodyEl.innerHTML    = parseLinks(ack.body);
  if (btnEl     && ack.buttonText)  btnEl.textContent   = ack.buttonText;
  if (imgEl     && ack.artwork)     imgEl.src           = ack.artwork;
  if (captionEl && ack.caption)     captionEl.textContent = ack.caption;
}
 
function applyAbout(about) {
  if (!about || !about.text) return;
  const el = document.querySelector('.intro-text p');
  if (el) el.innerHTML = parseLinks(about.text);
}
 
function applyContact(c) {
  if (!c) return;
 
  const wrap = document.querySelector('.footer-contact');
  if (wrap) {
    wrap.innerHTML = `
      <span class="footer-contact-heading-wrap">
        <span class="footer-contact-heading">${c.heading || ''}</span>
      </span>
      ${c.address ? `<a href="${c.addressLink || '#'}" target="_blank" rel="noopener noreferrer" class="footer-contact-line">${c.address}</a>` : ''}
      ${c.phone ? `<span class="footer-contact-line">${c.phone}</span>` : ''}
      ${c.email ? `<a href="mailto:${c.email}" class="footer-contact-line">${c.email}</a>` : ''}
    `;
  }
 
  const creditEl = document.querySelector('.footer-credit p');
  if (creditEl && c.credit) {
    creditEl.innerHTML = parseLinks(c.credit);
    wrapLettersIn(creditEl, 0.06);
  }
}
 
function applyPanel(pageName, key, data) {
  const panel = document.querySelector(`[data-page="${pageName}"] .panel-content`);
  if (!panel) return;
 
  const blocks = (data && data.blocks) || [];
  panel.innerHTML = buildPanel(blocks);
 
  panel.querySelectorAll('a').forEach(link => {
    if (link.getAttribute('href')?.startsWith('http')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
 
  // Wrap each caption letter in a span for the wave animation
  wrapLettersIn(panel.querySelectorAll('.cms-caption'));
}
 
// Show loading state in each panel
Object.keys(pageKeys).forEach(pageName => {
  const panel = document.querySelector(`[data-page="${pageName}"] .panel-content`);
  if (panel) panel.innerHTML = `<p style="opacity:0.4;font-size:0.9rem;">Loading…</p>`;
});
 
// Fetch each file independently, so one failure doesn't block the rest
function loadJSON(path) {
  return fetch(path)
    .then(res => res.ok ? res.json() : null)
    .catch(err => {
      console.error(`Failed to load ${path}:`, err);
      return null;
    });
}
 
Promise.all(
  Object.entries(CMS_FILES).map(([key, path]) =>
    loadJSON(path).then(data => [key, data])
  )
).then(entries => {
  const data = Object.fromEntries(entries);
 
  // Site-wide content
  applyAcknowledgement(data.acknowledgement);
  applyAbout(data.about);
  applyContact(data.contact);
 
  // Panels
  Object.entries(pageKeys).forEach(([pageName, key]) => {
    if (data[key]) {
      applyPanel(pageName, key, data[key]);
    } else {
      const panel = document.querySelector(`[data-page="${pageName}"] .panel-content`);
      if (panel) panel.innerHTML = `<p style="opacity:0.5;">Content unavailable.</p>`;
    }
  });
 
  // Sync all panel heights to match the tallest one
  requestAnimationFrame(() => {
    syncPanelHeights();
 
    // Re-sync once any images inside panels finish loading
    document.querySelectorAll('.panel-content img').forEach(img => {
      if (!img.complete) {
        img.addEventListener('load',  () => syncPanelHeights(), { once: true });
        img.addEventListener('error', () => syncPanelHeights(), { once: true });
      }
    });
  });
});
 
 
// ===============================
// PANEL HEIGHT SYNC (desktop only)
// ===============================
// Measures the rendered content of every panel as if it were active,
// then sets the slider's min-height to the tallest one so every panel
// expands to the same length.
 
function syncPanelHeights() {
  const slider = document.getElementById("contentSlider");
  if (!slider) return;
 
  // Mobile: panels stack vertically and grow naturally. Clear any inline height.
  if (window.innerWidth <= 768) {
    slider.style.height = "";
    return;
  }
 
  // Reset to get accurate slider width (CSS will keep it at 100vh)
  slider.style.height = "";
 
  const sliderWidth = slider.offsetWidth;
  const allPanels = [...document.querySelectorAll(".panel")];
  if (!allPanels.length) return;
 
  // Each active panel takes flex 5 out of (4 × 0.35 + 5) = 6.4 total.
  // Subtract the panel-title width to get the content's actual rendered width.
  const titleEl = allPanels[0].querySelector(".panel-title");
  const titleWidth = titleEl ? titleEl.offsetWidth : 80;
  const activeContentWidth = Math.max((sliderWidth * 5 / 6.4) - titleWidth, 300);
 
  let maxHeight = 0;
 
  allPanels.forEach(panel => {
    const content = panel.querySelector(".panel-content");
    if (!content) return;
 
    // Clone the content into an off-screen wrapper sized to the active width,
    // free of flex-stretch and overflow constraints, so we get its true height.
    const clone = content.cloneNode(true);
    clone.style.cssText = `
      width: 100%;
      max-width: 1400px;
      padding: 40px;
      height: auto;
      max-height: none;
      overflow: visible;
      position: static;
      opacity: 1;
      margin: 0;
      display: block;
      box-sizing: border-box;
    `;
 
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      position: fixed;
      left: -99999px;
      top: 0;
      width: ${activeContentWidth}px;
      visibility: hidden;
      pointer-events: none;
    `;
    wrap.appendChild(clone);
    document.body.appendChild(wrap);
 
    const h = clone.offsetHeight;
    document.body.removeChild(wrap);
 
    if (h > maxHeight) maxHeight = h;
  });
 
  // Only grow beyond the viewport if content genuinely overflows.
  // Otherwise leave the CSS default (height: 100vh) to do its job.
  if (maxHeight > window.innerHeight) {
    slider.style.height = maxHeight + "px";
  } else {
    slider.style.height = "";
  }
}
 
// Re-sync on resize (debounced)
let _resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(syncPanelHeights, 200);
});
 
 
// ===============================
// PANEL SYSTEM
// ===============================
 
const panels = document.querySelectorAll(".panel");
 
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
 
document.querySelectorAll(".panel").forEach(panel => {
  panel.addEventListener("mouseenter", () => {
    if (window.innerWidth <= 768) return;
    panels.forEach(p => p.classList.remove("active"));
    panel.classList.add("active");
  });
});
 
 
// ===============================
// LOADER LETTER ANIMATION
// ===============================
// Wraps each letter of "Loading Grasslands..." in a span with a
// staggered animation-delay so they take turns lifting up.
 
(function animateLoaderText() {
  const loaderP = document.querySelector('#loader .loader-inner p');
  if (!loaderP) return;
  const text = loaderP.textContent;
  loaderP.innerHTML = [...text].map((ch, i) => {
    if (ch === ' ') return ' ';
    return `<span style="animation-delay:${i * 0.08}s">${ch}</span>`;
  }).join('');
})();
 
 
// ===============================
// LOAD
// ===============================
 
window.addEventListener("load", () => {
 
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
 
document.addEventListener("mouseover", e => {
  if (e.target.closest("a, button, .panel-title, #ack-enter")) {
    cursor.classList.add("hovering");
  } else {
    cursor.classList.remove("hovering");
  }
});