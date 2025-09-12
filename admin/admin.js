(function () {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  const api = {
    login: (password) =>
      fetch("/.netlify/functions/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }).then((r) => r.json()),

    stats: (token, since) =>
      fetch("/.netlify/functions/admin-stats?since=" + since, {
        headers: { Authorization: "Bearer " + token },
      }).then((r) => r.json()),

    events: (token, since, limit = 200) =>
      fetch(
        "/.netlify/functions/admin-events?since=" + since + "&limit=" + limit,
        {
          headers: { Authorization: "Bearer " + token },
        }
      ).then((r) => r.json()),
  };

  function setToken(t) {
    sessionStorage.setItem("tp_admin_token", t);
  }
  function getToken() {
    return sessionStorage.getItem("tp_admin_token");
  }
  function logout() {
    sessionStorage.removeItem("tp_admin_token");
    location.reload();
  }

  // Wire up static listeners
  $("#logout").addEventListener("click", logout);
  $("#range").addEventListener("change", load);

  // Login
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pwd = $("#password").value.trim();
    $("#loginMsg").textContent = "";
    try {
      const res = await api.login(pwd);
      if (res.error) {
        $("#loginMsg").textContent = res.error;
        return;
      }
      if (res.token) {
        setToken(res.token);
        $("#login").classList.add("hidden");
        $("#dash").classList.remove("hidden");
        load();
      } else {
        $("#loginMsg").textContent = "Unexpected response.";
      }
    } catch (err) {
      $("#loginMsg").textContent = "Network error. Try again.";
    }
  });

  // Load dashboard
  async function load() {
    const token = getToken();
    if (!token) return;

    const range = $("#range").value;

    // fetch stats + events in parallel
    const [s, e] = await Promise.allSettled([
      api.stats(token, range),
      api.events(token, range, 200),
    ]);

    // Stats
    const stats = s.status === "fulfilled" ? s.value : null;
    if (stats && !stats.error) {
      $("#pv").textContent = stats.pageviews ?? 0;
      $("#ev").textContent = stats.totalEvents ?? 0;

      // Top pages (UNCHANGED: no cap)
      fillTable($("#topPages tbody"), stats.topPages || [], (r) => [
        r.key,
        r.count,
      ]);

      // Top referrers (UNCHANGED)
      fillTable($("#topRef tbody"), stats.topReferrers || [], (r) => [
        r.key,
        r.count,
      ]);
    } else {
      // basic clear on error
      $("#pv").textContent = "–";
      $("#ev").textContent = "–";
      fillTable($("#topPages tbody"), [], () => []);
      fillTable($("#topRef tbody"), [], () => []);
    }

    // Recent events (ONLY place with paging)
    const ev = e.status === "fulfilled" ? e.value : null;
    if (ev && !ev.error) {
      setupEventsPager(ev.items || []);
    } else {
      setupEventsPager([]);
    }
  }

  // Helpers
  function fillTable(tbody, rows, mapFn) {
    tbody.innerHTML = rows
      .map((r) => {
        const cols = mapFn(r)
          .map((x) => `<td>${escapeHtml(String(x ?? ""))}</td>`)
          .join("");
        return `<tr>${cols}</tr>`;
      })
      .join("");
  }

  function escapeHtml(s) {
    return s.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[m])
    );
  }

  // ONLY for Recent events
  function setupEventsPager(rows) {
    const tbody = $("#events tbody");
    const moreBtn = $("#eventsMore");
    const lessBtn = $("#eventsLess");
    const initial = 10;
    const step = 10;

    let shown = Math.min(initial, rows.length);

    function render() {
      const slice = rows.slice(0, shown);
      fillTable(tbody, slice, (r) => [
        formatTs(r.ts),
        r.event_type,
        r.path,
        r.referrer || "(direct)",
      ]);

      if (moreBtn) moreBtn.classList.toggle("hidden", shown >= rows.length);
      if (lessBtn) lessBtn.classList.toggle("hidden", shown <= initial);
    }

    if (moreBtn)
      moreBtn.onclick = () => {
        shown = Math.min(shown + step, rows.length);
        render();
      };

    if (lessBtn)
      lessBtn.onclick = () => {
        shown = Math.min(initial, rows.length);
        render();
      };

    render();
  }

  function formatTs(ts) {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return String(ts ?? "");
    }
  }

  // Auto-show dashboard if already logged in
  if (getToken()) {
    $("#login").classList.add("hidden");
    $("#dash").classList.remove("hidden");
    load();
  }
})();
