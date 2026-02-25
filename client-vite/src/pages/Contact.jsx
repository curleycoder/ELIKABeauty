import { Helmet } from "react-helmet-async";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
      <Helmet>
        <title>Contact | Elika Beauty</title>
        <meta
          name="description"
          content="Contact Elika Beauty in Burnaby. Call, get directions or book your appointment online."
        />
        <link rel="canonical" href="https://elikabeauty.ca/contact" />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purplecolor">
          Contact Elika Beauty
        </h1>

        <div className="mt-6 space-y-3">
          <p>
            <strong>Phone:</strong>{" "}
            <a className="underline" href="tel:+16044383727">
              (604) 438-3727
            </a>
          </p>

          <p>
            <strong>Address:</strong>{" "}
            3790 Canada Way #102, Burnaby, BC V5G 1G4
          </p>

          <p>Edward Jones Plaza</p>
          <p>Plaza parking available • Pay parking on street</p>
        </div>
      </div>
    </div>
  );
}