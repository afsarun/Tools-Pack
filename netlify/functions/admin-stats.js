
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { ok, bad, verifyToken, CORS_HEADERS } = require('./_common.js');

function groupBy(arr, keyFn) {
  const m = new Map();
  for (const x of arr) {
    const k = keyFn(x);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return Array.from(m.entries()).map(([k, v]) => ({ key: k, count: v })).sort((a,b)=>b.count-a.count);
}

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  const auth = event.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!verifyToken(token)) return bad(401, 'Unauthorized');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return bad(500, 'Server not configured');

  const q = event.queryStringParameters || {};
  const sinceDays = parseInt(q.since || '7', 10);
  const sinceISO = new Date(Date.now() - sinceDays*24*3600*1000).toISOString();
  const limit = Math.min(parseInt(q.limit || '5000', 10), 10000);

  const url = `${SUPABASE_URL}/rest/v1/events?select=site_id,session_id,user_id,ip_hash,user_agent,referrer,url,path,event_type,ts&site_id=eq.${process.env.SITE_ID||'default'}&ts=gte.${encodeURIComponent(sinceISO)}&order=ts.desc&limit=${limit}`;

  const resp = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`
    }
  });

  if (!resp.ok) {
    const text = await resp.text();
    return bad(500, `Supabase error: ${text}`);
  }
  const events = await resp.json();

  const totalEvents = events.length;
  const pageviews = events.filter(e => e.event_type === 'pageview').length;

  const byDate = groupBy(events, e => (e.ts || '').slice(0,10));
  const topPages = groupBy(events, e => e.path || e.url).slice(0, 20);
  const topReferrers = groupBy(events, e => e.referrer || '(direct)').slice(0, 20);
  const byDevice = groupBy(events, e => (e.user_agent||'').includes('Mobile') ? 'Mobile' : 'Desktop');

  return ok({ totalEvents, pageviews, byDate, topPages, topReferrers, byDevice });
};
