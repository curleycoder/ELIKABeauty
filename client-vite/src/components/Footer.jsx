import { Link } from "react-router-dom";
import { FaInstagram, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const HOURS = [
  { day: "Monday",    hours: "10:00 AM – 7:00 PM" },
  { day: "Tuesday",   hours: "10:00 AM – 7:00 PM" },
  { day: "Wednesday", hours: "10:00 AM – 7:00 PM" },
  { day: "Thursday",  hours: "10:00 AM – 7:00 PM" },
  { day: "Friday",    hours: "10:00 AM – 7:00 PM" },
  { day: "Saturday",  hours: "10:00 AM – 6:00 PM" },
  { day: "Sunday",    hours: "Closed" },
];

function getTodayStatus() {
  const now = new Date();
  const day = now.toLocaleDateString("en-CA", { timeZone: "America/Vancouver", weekday: "long" });
  const entry = HOURS.find((h) => h.day === day);
  if (!entry || entry.hours === "Closed") return { label: "Closed today", open: false };

  const [openStr, closeStr] = entry.hours.split(" – ");
  const toMin = (str) => {
    const [time, period] = str.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const open = nowMin >= toMin(openStr) && nowMin < toMin(closeStr);
  return { label: open ? `Open today · ${entry.hours}` : `Closed · Opens ${openStr}`, open };
}

export default function Footer() {
  const status = getTodayStatus();

  return (
    <footer className="bg-[#2e1118] text-white/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <p className="font-theseason text-2xl text-white tracking-wide">ELIKA</p>
          <p className="text-xs uppercase tracking-widest text-white/50 mt-0.5">Beauty Salon</p>
          <p className="mt-4 text-sm leading-6">
            Professional hair salon in Burnaby specializing in balayage, highlights, hair colour, keratin treatments, and more.
          </p>
          <a
            href="https://www.instagram.com/elikabeauty.ca/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
          >
            <FaInstagram /> @elikabeauty.ca
          </a>
        </div>

        {/* Services */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Services</p>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/balayage-burnaby", label: "Balayage" },
              { to: "/highlights-burnaby", label: "Highlights" },
              { to: "/hair-color-burnaby", label: "Hair Color" },
              { to: "/keratin-treatment-burnaby", label: "Keratin Treatment" },
              { to: "/womens-haircut-burnaby", label: "Women's Haircut" },
              { to: "/mens-haircut-burnaby", label: "Men's Haircut" },
              { to: "/microblading-burnaby", label: "Microblading" },
              { to: "/facial-treatment-burnaby", label: "Facial Treatment" },
            ].map((s) => (
              <li key={s.to}>
                <Link to={s.to} className="hover:text-white transition">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Hours</p>
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${status.open ? "bg-green-700/40 text-green-300" : "bg-white/10 text-white/50"}`}>
            <FaClock className="text-[10px]" /> {status.label}
          </div>
          <ul className="space-y-1.5 text-sm">
            {HOURS.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span className="text-white/50">{h.day.slice(0, 3)}</span>
                <span className={h.hours === "Closed" ? "text-white/30" : ""}>{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Contact</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="tel:+16044383727" className="flex items-start gap-2 hover:text-white transition">
                <FaPhone className="mt-0.5 shrink-0 text-white/40" />
                (604) 438-3727
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/place/ELIKA+BEAUTY+(Tangles+Hair+Design)/"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 hover:text-white transition"
              >
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-white/40" />
                3790 Canada Way #102<br />Burnaby, BC V5G 1G4
              </a>
            </li>
          </ul>

          <div className="mt-6">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-[#572a31] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition"
            >
              Book Appointment
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/40">
            <Link to="/privacy-policy" className="hover:text-white/70 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70 transition">Terms</Link>
            <Link to="/contact" className="hover:text-white/70 transition">Contact</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/30">
        © {new Date().getFullYear()} Elika Beauty · 3790 Canada Way #102, Burnaby, BC · (604) 438-3727
      </div>
    </footer>
  );
}
