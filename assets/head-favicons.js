// /assets/head-favicons.js
(function () {
  const ASSET = "/assets"; // change if you store icons somewhere else
  const head = document.head || document.getElementsByTagName("head")[0];
  if (!head) return;

  function appendLink(attrs) {
    const el = document.createElement("link");
    Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
    head.appendChild(el);
    return el;
  }

  function appendMeta(attrs) {
    const el = document.createElement("meta");
    Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
    head.appendChild(el);
    return el;
  }

  function exists(selector) {
    try {
      return !!head.querySelector(selector);
    } catch {
      return false;
    }
  }

  // Add a root favicon as well as the assets one if you prefer both.
  // Many crawlers look for /favicon.ico — keep a copy at site root for safety.
  if (!exists('link[rel="icon"][href="' + ASSET + '/favicon.ico"]')) {
    appendLink({ rel: "icon", href: ASSET + "/favicon.ico", sizes: "any" });
  }

  if (!exists('link[rel="icon"][sizes="16x16"]')) {
    appendLink({
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: ASSET + "/favicon-16x16.png",
    });
  }

  if (!exists('link[rel="icon"][sizes="32x32"]')) {
    appendLink({
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: ASSET + "/favicon-32x32.png",
    });
  }

  if (!exists('link[rel="apple-touch-icon"]')) {
    appendLink({
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: ASSET + "/apple-touch-icon.png",
    });
  }

  if (!exists('link[rel="manifest"]')) {
    appendLink({ rel: "manifest", href: ASSET + "/site.webmanifest" });
  }

  if (!exists('meta[name="theme-color"]')) {
    appendMeta({ name: "theme-color", content: "#ffffff" });
  }

  if (!exists('meta[name="msapplication-TileImage"]')) {
    appendMeta({
      name: "msapplication-TileImage",
      content: ASSET + "/mstile-144x144.png",
    });
  }
})();
