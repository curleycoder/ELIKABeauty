import crypto from "crypto";

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function parseCookies(header = "") {
  return header.split(";").reduce((acc, part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(v.join("="));
    return acc;
  }, {});
}

function verifySession(cookieValue, secret) {
  if (!cookieValue) return false;
  const [ts, sig] = cookieValue.split(".");
  if (!ts || !sig) return false;

  const ageMs = Date.now() - Number(ts);
  if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > 8 * 60 * 60 * 1000) return false;

  return sign(ts, secret) === sig;
}

export default async function handler(req, res) {
  const SECRET = process.env.ADMIN_SESSION_SECRET;
  const RENDER_API_URL = process.env.RENDER_API_URL;
  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!SECRET || !RENDER_API_URL || !ADMIN_KEY) {
    return res.status(500).json({ error: "Server not configured" });
  }

  const cookies = parseCookies(req.headers.cookie || "");
  if (!verifySession(cookies.admin_session, SECRET)) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const r = await fetch(`${RENDER_API_URL}/api/bookings`, {
    headers: { "x-admin-key": ADMIN_KEY },
  });

  const text = await r.text();
  res.status(r.status);
  res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
  return res.send(text);
}
