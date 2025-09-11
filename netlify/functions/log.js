const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { ok, bad, sha256Hex, CORS_HEADERS } = require("./_common.js");

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return bad(405, "Method not allowed");
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return bad(400, "Invalid JSON");
  }

  const url = body.url || "";
  const referrer = body.referrer || "";
  const userAgent = event.headers["user-agent"] || "";
  const sessionId = body.sessionId || null;
  const userId = body.userId || null;
  const eventType = body.eventType || "pageview";
  const meta = body.meta || {};
  const siteId = process.env.TP_SITE_ID || "default";

  const clientIp = (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    ""
  )
    .split(",")[0]
    .trim();
  const ipHash = clientIp
    ? sha256Hex((process.env.IP_SALT || "salt") + clientIp)
    : null;

  let path = "";
  try {
    path = new URL(url).pathname;
  } catch (_) {
    path = url;
  }

  const row = {
    site_id: siteId,
    session_id: sessionId,
    user_id: userId,
    ip_hash: ipHash,
    user_agent: userAgent,
    referrer,
    url,
    path,
    event_type: eventType,
    meta,
    ts: new Date().toISOString(),
  };

  // Insert into Supabase REST
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return bad(500, "Server not configured (missing SUPABASE envs)");
  }

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(row),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return bad(500, `Supabase error: ${text}`);
  }

  return ok({ status: "ok" });
};
