
const { ok, bad, signToken, CORS_HEADERS } = require('./_common.js');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return bad(405, 'Method not allowed');
  }
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return bad(400, 'Invalid JSON'); }

  const password = body.password || '';
  const expected = process.env.ADMIN_PASSWORD || 'changeme';

  if (password !== expected) {
    return bad(401, 'Invalid credentials');
  }
  // 24h token
  const token = signToken(60*60*24);
  return ok({ token });
};
