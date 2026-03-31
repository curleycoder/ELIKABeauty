import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <>
    <Helmet>
      <title>Privacy Policy | Elika Beauty</title>
      <meta name="description" content="Read the Elika Beauty privacy policy. Learn how we collect, use, and protect your personal information when you use our website or book an appointment." />
      <link rel="canonical" href="https://elikabeauty.ca/privacy-policy" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <div className="max-w-3xl mx-auto px-4 py-16 pt-24">
      <h1 className="text-3xl font-theseason text-[#440008] mb-6">
        Privacy Policy
      </h1>

      <p className="mb-4">
        Elika Beauty respects your privacy and is committed to protecting your
        personal information.
      </p>

      <p className="mb-4">
        When you use this website, we may collect limited information such as
        your name, phone number, or email when you contact us or book an
        appointment.
      </p>

      <p className="mb-4">
        This information is used only to respond to inquiries, manage salon
        appointments, and improve the website experience. We do not sell or
        share personal information for marketing purposes.
      </p>

      <p className="mb-4">
        This website may use cookies or analytics tools to understand how
        visitors use the site and improve the experience.
      </p>

      <p>
        If you have questions about this policy, contact ELIKA BEAUTY at
        (604) 438-3727.
      </p>
    </div>
    </>
  );
}