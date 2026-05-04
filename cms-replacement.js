// ===============================
// PAGES CMS — single JSON file
// (replaces the entire "GOOGLE SHEETS CMS" section in main.js)
// ===============================

const CMS_FILE = "/content.json";

const pageKeys = {
  "grasslands-page": "grasslands",
  "research-page":   "research",
  "education-page":  "education",
  "engagement-page": "engagement",
  "nursery-page":    "nursery"
};

function renderBlock(b) {
  if (b.type === "text") {
    return `<div class="cms-block cms-text"><p>${b.text}</p></div>`;
  }
  if (b.type === "heading") {
    return `<div class="cms-block cms-heading"><h2>${b.text}</h2></div>`;
  }
  if (b.type === "list") {
    const items = (b.text || "")
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
      if (b.type === "intro")   html += `<div class="cms-full cms-intro"><p>${b.text}</p></div>`;
      if (b.type === "heading") html += `<div class="cms-full cms-heading"><h2>${b.text}</h2></div>`;
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
