
(function(){
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));
  const api = {
    login: (password) => fetch('/.netlify/functions/admin-login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password })}).then(r=>r.json()),
    stats: (token, since) => fetch('/.netlify/functions/admin-stats?since='+since, { headers:{ 'Authorization':'Bearer '+token }}).then(r=>r.json()),
    events: (token, since, limit) => fetch('/.netlify/functions/admin-events?since='+since+'&limit='+(limit||200), { headers:{ 'Authorization':'Bearer '+token }}).then(r=>r.json())
  };

  function setToken(t){ sessionStorage.setItem('tp_admin_token', t); }
  function getToken(){ return sessionStorage.getItem('tp_admin_token'); }
  function logout(){ sessionStorage.removeItem('tp_admin_token'); location.reload(); }

  $('#logout').addEventListener('click', logout);

  $('#loginForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const pwd = $('#password').value.trim();
    $('#loginMsg').textContent = '';
    const res = await api.login(pwd);
    if (res.error) { $('#loginMsg').textContent = res.error; return; }
    if (res.token) {
      setToken(res.token);
      $('#login').classList.add('hidden');
      $('#dash').classList.remove('hidden');
      load();
    }
  });

  async function load(){
    const token = getToken();
    if (!token) return;
    const range = $('#range').value;
    const [s, e] = await Promise.all([api.stats(token, range), api.events(token, range, 200)]);
    if (s && !s.error) {
      $('#pv').textContent = s.pageviews || 0;
      $('#ev').textContent = s.totalEvents || 0;
      fillTable($('#topPages tbody'), s.topPages || [], (r)=>[r.key, r.count]);
      fillTable($('#topRef tbody'), s.topReferrers || [], (r)=>[r.key, r.count]);
    }
    if (e && !e.error) {
      fillTable($('#events tbody'), e.items || [], (r)=>[new Date(r.ts).toLocaleString(), r.event_type, r.path, r.referrer || '(direct)']);
    }
  }

  function fillTable(tbody, rows, mapFn){
    tbody.innerHTML = rows.map(r => {
      const cols = mapFn(r).map(x => `<td>${escapeHtml(String(x||''))}</td>`).join('');
      return `<tr>${cols}</tr>`;
    }).join('');
  }
  function escapeHtml(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

  $('#range').addEventListener('change', load);

  // Auto-show dashboard if token exists
  if (getToken()) {
    $('#login').classList.add('hidden');
    $('#dash').classList.remove('hidden');
    load();
  }
})();
