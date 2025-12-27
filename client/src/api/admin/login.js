import crypto from "crypto";

function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "Missing password" });

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SECRET = process.env.ADMIN_SESSION_SECRET;

  if (!ADMIN_PASSWORD || !SECRET) {
    return res.status(500).json({ error: "Server not configured" });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const ts = Date.now().toString();
  const token = `${ts}.${sign(ts, SECRET)}`;

  res.setHeader(
    "Set-Cookie",
    `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 8}`
  );

  return res.json({ ok: true });
}
