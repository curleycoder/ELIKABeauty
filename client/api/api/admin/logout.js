import { useEffect, useState } from "react";

export default function AdminBookingsSecret() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const r = await fetch("/api/admin/bookings");
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setAuthed(false);
      setBookings([]);
      setError(j.error || "Not logged in");
      return;
    }
    setAuthed(true);
    setBookings(await r.json());
  }

  async function login(e) {
    e.preventDefault();
    setError("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setError(j.error || "Login failed");
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout");
    setAuthed(false);
    setBookings([]);
  }

  useEffect(() => { load(); }, []);

  if (!authed) {
    return (
      <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
        <h2>Admin</h2>
        <form onSubmit={login}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", padding: 10 }}
          />
          <button style={{ marginTop: 10, width: "100%", padding: 10 }}>Login</button>
        </form>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Bookings</h2>
        <div>
          <button onClick={load} style={{ marginRight: 10 }}>Refresh</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(bookings, null, 2)}</pre>
    </div>
  );
}
