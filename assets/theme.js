/* /assets/theme.js
   Injects theme meta + toggle if absent. Default = "light". Persists to localStorage.
   Add only this line to every page's <head>: <script src="/assets/theme.js" defer></script>
*/
(function () {
  // run early but defer behavior ensures DOMContentLoaded fires after
  function safe(fn) {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  }

  safe(function () {
    // ensure meta[name="theme-color"] exists and has id for quick updates
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.id = meta.id || "meta-theme-color";

    // read saved theme or default to light
    var saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {}
    var initial = saved || "light";

    // apply theme attribute immediately to avoid flash
    document.documentElement.setAttribute("data-theme", initial);
    if (meta)
      meta.setAttribute("content", initial === "dark" ? "#1E1E2F" : "#ffffff");

    // helper to switch
    function applyTheme(t) {
      document.documentElement.setAttribute("data-theme", t);
      try {
        localStorage.setItem("theme", t);
      } catch (e) {}
      if (meta)
        meta.setAttribute("content", t === "dark" ? "#1E1E2F" : "#ffffff");
      // if toggle exists, update its UI
      var toggle = document.getElementById("theme-toggle");
      var icon = document.getElementById("theme-toggle-icon");
      if (toggle) {
        toggle.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
        if (icon) icon.textContent = t === "dark" ? "☀️" : "🌙";
      }
    }

    // If header already contains a #theme-toggle, just wire it up
    function wireExistingToggle() {
      var btn = document.getElementById("theme-toggle");
      if (!btn) return false;
      btn.addEventListener("click", function () {
        var cur =
          document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(cur === "dark" ? "light" : "dark");
      });
      // set initial UI state
      var icon = document.getElementById("theme-toggle-icon");
      if (icon) icon.textContent = initial === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-pressed", initial === "dark" ? "true" : "false");
      return true;
    }

    if (wireExistingToggle()) return;

    // Otherwise inject a small button into the first header-like element
    var injected = false;
    var header =
      document.querySelector("header") ||
      document.querySelector(".wrap") ||
      document.body;
    if (header) {
      var btn = document.createElement("button");
      btn.id = "theme-toggle";
      btn.className = "btn";
      btn.setAttribute("aria-pressed", initial === "dark" ? "true" : "false");
      btn.setAttribute("title", "Toggle theme");
      btn.setAttribute("aria-label", "Toggle light and dark theme");
      btn.style.background = "none";
      btn.style.border = "1px solid";
      btn.style.padding = "6px 10px";
      btn.style.borderRadius = "8px";
      btn.style.cursor = "pointer";
      btn.style.marginLeft = "8px";
      // icon span
      var icon = document.createElement("span");
      icon.id = "theme-toggle-icon";
      icon.textContent = initial === "dark" ? "☀️" : "🌙";
      btn.appendChild(icon);
      // append to header's right side if possible
      // try to put in a container at the end of header
      try {
        // prefer a flex container with margin-left:auto
        var right =
          header.querySelector('[style*="margin-left: auto"]') || header;
        right.appendChild(btn);
      } catch (e) {
        header.appendChild(btn);
      }
      btn.addEventListener("click", function () {
        var cur =
          document.documentElement.getAttribute("data-theme") || "light";
        var next = cur === "dark" ? "light" : "dark";
        applyTheme(next);
      });
      injected = true;
    }

    // expose for debugging
    window.applySiteTheme = applyTheme;
  });
})();

(function () {
  try {
    const KEY = "site-theme";
    const stored = localStorage.getItem(KEY);
    if (stored === "dark")
      document.documentElement.setAttribute("data-theme", "dark");
    else if (stored === "light")
      document.documentElement.removeAttribute("data-theme");
    else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (e) {
    /* fail silently */
  }
})();
