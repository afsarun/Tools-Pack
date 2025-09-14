(() => {
  // --- Normalize paths (strip index.html, ensure trailing slash) ---
  const norm = (p) => {
    try {
      const u = new URL(p, location.origin);
      let s = u.pathname.replace(/index\.html$/, "");
      if (s !== "/" && !s.endsWith("/")) s += "/";
      return s;
    } catch {
      return p;
    }
  };

  // --- All known tool URLs (add/remove as your site grows) ---
  const ALL = {
    en: [
      ["/json-formatter/", "JSON Formatter"],
      ["/calculator/", "Calculator"],
      ["/unit-converter/", "Unit Converter"],
      ["/age-calculator/", "Age Calculator"],
      ["/text-utilities/", "Text Utilities"],
      ["/base64/", "Base64 Encoder/Decoder"],
      ["/url-tools/", "URL Encoder/Decoder"],
      ["/password-uuid/", "Password Generator"],
      ["/uuid-v4/", "UUID v4"],
      ["/sha256/", "SHA-256 Hash"],
      ["/image-resizer-compressor/", "Image Resizer/Compressor"],
      ["/color-contrast/", "Color Picker & Contrast"],
      ["/color-picker-contrast/", "Color Picker & Contrast"], // legacy alias
      ["/stopwatch-countdown/", "Stopwatch & Countdown"],
      ["/quick-notes/", "Quick Notes"],
      ["/text-to-pdf/", "Text → PDF"],
      ["/percent-calculator/", "Percentage Calculator"],
      ["/percent/", "Percentage Calculator"], // legacy alias
    ],
    bn: [
      ["/bn/json-formatter/", "JSON ফরম্যাটার"],
      ["/bn/calculator/", "ক্যালকুলেটর"],
      ["/bn/unit-converter/", "ইউনিট কনভার্টার"],
      ["/bn/age-calculator/", "বয়স নির্ণায়ক"],
      ["/bn/text-utilities/", "টেক্সট ইউটিলিটিজ"],
      ["/bn/base64/", "Base64 এনকোডার/ডিকোডার"],
      ["/bn/url-tools/", "URL এনকোড/ডিকোড"],
      ["/bn/password-uuid/", "পাসওয়ার্ড জেনারেটর"],
      ["/bn/uuid-v4/", "UUID v4"],
      ["/bn/uuid4/", "UUID v4"], // legacy alias
      ["/bn/sha256/", "SHA-256 হ্যাশ"],
      ["/bn/image-resizer-compressor/", "ইমেজ রিসাইজার/কমপ্রেসর"],
      ["/bn/color-contrast/", "কালার পিকার/কনট্রাস্ট"],
      ["/bn/color-picker-contrast/", "কালার পিকার/কনট্রাস্ট"], // alias
      ["/bn/stopwatch-countdown/", "স্টপওয়াচ/কাউন্টডাউন"],
      ["/bn/quick-notes/", "নোটস"],
      ["/bn/text-to-pdf/", "টেক্সট → PDF"],
      ["/bn/percent-calculator/", "শতকরা ক্যালকুলেটর"],
    ],
  };

  // --- Detect language from path ---
  const current = norm(location.pathname);
  const lang = current.startsWith("/bn/") ? "bn" : "en";

  // --- Collect hrefs already present inside your existing related block ---
  const existingRelatedSelectors = [
    "#related a",
    "article#related a",
    "section#related a",
    'article.card h2:contains("Related")',
  ];
  const existingHrefs = new Set(
    Array.from(
      document.querySelectorAll(
        "#related a, article#related a, section#related a"
      )
    ).map((a) => norm(a.getAttribute("href") || ""))
  );

  // --- Build candidate pool: internal tools for this language, excluding current & already-linked ---
  const pool = [];
  const seen = new Set();
  for (const [href, label] of ALL[lang]) {
    const h = norm(href);
    if (h === current) continue;
    if (existingHrefs.has(h)) continue;
    if (seen.has(h)) continue; // de-dup aliases
    seen.add(h);
    pool.push([h, label]);
  }

  // Pick 4–5 extras
  const extra = pool.slice(0, 5); // change to 4 if you prefer strictly 4

  if (!extra.length) return;

  // --- Find the existing Related block; if missing, create one (but DO NOT overwrite existing content) ---
  let related = document.getElementById("related");
  if (!related) {
    related = document.createElement("article");
    related.id = "related";
    related.className = "card";
    const h2 = document.createElement("h2");
    h2.textContent = lang === "bn" ? "সম্পর্কিত টুলস" : "Related tools";
    related.appendChild(h2);
    (
      document.querySelector("main.wrap") ||
      document.querySelector("main") ||
      document.body
    ).appendChild(related);
  }

  // --- Append a “More tools” row UNDER the existing content (keeps your current links untouched) ---
  // Avoid duplicate insert on re-execution:
  if (document.getElementById("related-more")) return;

  const moreWrap = document.createElement("div");
  moreWrap.id = "related-more";
  moreWrap.innerHTML = `
    <h3 style="margin-top:0.5rem">${
      lang === "bn" ? "আরও টুলস" : "More tools"
    }</h3>
    <p class="muted">${
      lang === "bn" ? "এগুলোও দেখতে পারেন:" : "You might also like:"
    }</p>
    <p>
      ${extra
        .map(([href, label]) => `<a class="btn" href="${href}">${label}</a>`)
        .join(" ")}
    </p>
  `;
  related.appendChild(moreWrap);
})();
