import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaPhone, FaMapMarkerAlt, FaInstagram, FaClock } from "react-icons/fa";

const HOURS = [
  { day: "Monday",    hours: "Closed" },
  { day: "Tuesday",   hours: "10:00 AM – 7:00 PM" },
  { day: "Wednesday", hours: "10:00 AM – 7:00 PM" },
  { day: "Thursday",  hours: "10:00 AM – 7:00 PM" },
  { day: "Friday",    hours: "10:00 AM – 7:00 PM" },
  { day: "Saturday",  hours: "10:00 AM – 7:00 PM" },
  { day: "Sunday",    hours: "Closed" },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-white pt-14 pb-16 text-gray-800">
      <Helmet>
        <title>Contact Elika Beauty | Hair Salon in Burnaby</title>
        <meta name="description" content="Contact Elika Beauty hair salon in Burnaby. Call (604) 438-3727, visit us at 3790 Canada Way #102, or book online. View our hours and location." />
        <link rel="canonical" href="https://elikabeauty.ca/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Elika Beauty | Hair Salon in Burnaby" />
        <meta property="og:description" content="Contact Elika Beauty hair salon in Burnaby. Call (604) 438-3727 or book online." />
        <meta property="og:url" content="https://elikabeauty.ca/contact" />
        <meta property="og:image" content="https://elikabeauty.ca/assets/salon.webp" />
        <meta property="og:site_name" content="Elika Beauty" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Elika Beauty | Hair Salon in Burnaby" />
        <meta name="twitter:description" content="Contact Elika Beauty hair salon in Burnaby. Call (604) 438-3727 or book online." />
        <meta name="twitter:image" content="https://elikabeauty.ca/assets/salon.webp" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <p className="text-xs uppercase tracking-widest text-[#8a6b73]">Elika Beauty · Burnaby</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-theseason text-[#572a31]">Contact Us</h1>
        <p className="mt-3 text-gray-600 max-w-xl">
          Book online, call us, or stop by. We're located in Burnaby at Canada Way, easy to reach from Brentwood and Metrotown.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">

          {/* Left — info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#572a31]/10 bg-[#fcfaf8] p-6">
              <p className="text-xs uppercase tracking-widest text-[#8a6b73] mb-4">Location</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=ELIKA+BEAUTY+3790+Canada+Way+Burnaby+BC"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-[#572a31] hover:underline"
              >
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                <span>3790 Canada Way #102<br />Burnaby, BC V5G 1G4</span>
              </a>
              <a
                href="tel:+16044383727"
                className="mt-4 flex items-center gap-3 text-[#572a31] hover:underline"
              >
                <FaPhone className="shrink-0" />
                (604) 438-3727
              </a>
              <a
                href="https://www.instagram.com/elikabeauty.ca/"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-3 text-[#572a31] hover:underline"
              >
                <FaInstagram className="shrink-0" />
                @elikabeauty.ca
              </a>
            </div>

            <div className="rounded-2xl border border-[#572a31]/10 bg-[#fcfaf8] p-6">
              <p className="text-xs uppercase tracking-widest text-[#8a6b73] mb-4 flex items-center gap-2">
                <FaClock /> Hours
              </p>
              <ul className="space-y-2 text-sm">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between">
                    <span className="text-gray-500">{h.day}</span>
                    <span className={h.hours === "Closed" ? "text-gray-400" : "font-medium text-[#572a31]"}>{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/booking"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#572a31] px-6 py-3 text-sm font-semibold text-white hover:brightness-110 transition"
            >
              Book Appointment Online
            </Link>
          </div>

          {/* Right — map embed */}
          <div className="rounded-2xl overflow-hidden border border-[#572a31]/10 min-h-[400px]">
            <iframe
              title="Elika Beauty location map"
              src="https://maps.google.com/maps?q=ELIKA+BEAUTY+3790+Canada+Way+Burnaby+BC&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
