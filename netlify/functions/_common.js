
const crypto = require('crypto');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

function ok(body, headers={}) {
  return { statusCode: 200, headers: {...CORS_HEADERS, ...headers}, body: JSON.stringify(body) };
}
function bad(status, message) {
  return { statusCode: status, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

// Token format: "<expEpoch>.<hmac>"
function signToken(ttlSeconds) {
  const exp = Math.floor(Date.now()/1000) + ttlSeconds;
  const secret = process.env.ADMIN_SECRET || 'change-me';
  const hmac = crypto.createHmac('sha256', secret).update(String(exp)).digest('hex');
  return `${exp}.${hmac}`;
}
function verifyToken(token) {
  if (!token) return false;
  const [expStr, mac] = token.split('.');
  if (!expStr || !mac) return false;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || exp*1000 < Date.now()) return false;
  const secret = process.env.ADMIN_SECRET || 'change-me';
  const expected = crypto.createHmac('sha256', secret).update(String(exp)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

module.exports = { CORS_HEADERS, ok, bad, signToken, verifyToken, sha256Hex };
