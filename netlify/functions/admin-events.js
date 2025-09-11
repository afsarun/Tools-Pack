const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { ok, bad, verifyToken, CORS_HEADERS } = require("./_common.js");

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  const auth = event.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!verifyToken(token)) return bad(401, "Unauthorized");

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE)
    return bad(500, "Server not configured");

  const q = event.queryStringParameters || {};
  const limit = Math.min(parseInt(q.limit || "200", 10), 1000);
  const sinceDays = parseInt(q.since || "30", 10);
  const sinceISO = new Date(
    Date.now() - sinceDays * 24 * 3600 * 1000
  ).toISOString();

  const url = `${SUPABASE_URL}/rest/v1/events?select=*&site_id=eq.${
    process.env.TP_SITE_ID || "default"
  }&ts=gte.${encodeURIComponent(sinceISO)}&order=ts.desc&limit=${limit}`;

  const resp = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    return bad(500, `Supabase error: ${text}`);
  }
  const data = await resp.json();
  return ok({ items: data });
};
