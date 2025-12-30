import React from "react";

export default function FAQ() {
  const faqs = [
  {
    question: "How long after balayage can I do keratin treatment?",
    answer: "It's best to wait at least 10–14 days after a balayage before doing keratin, to let the color settle and avoid overlap in chemical effects."
  },
  {
    question: "How much time does microblading need to show nice results?",
    answer: "Microblading takes about 7–10 days to scab and heal on the surface, but full results are visible after 4–6 weeks once the skin regenerates."
  },
  {
    question: "What aftercare should I follow after microblading?",
    answer: "Avoid sweating, water, and makeup on the brows for the first week. Keep the area clean and use ointment as recommended. Avoid sun and picking at scabs."
  },
  {
    question: "Is there a touch-up required for microblading?",
    answer: "Yes, a touch-up is typically needed 4–6 weeks after the first session to perfect the shape, fill in gaps, and adjust the color if needed."
  },
  {
    question: "Can I go blonde if I've previously dyed my hair black, red, or used henna?",
    answer: "It depends. Going blonde from black, red, or henna-colored hair is possible but needs a color correction process and may take multiple sessions to protect your hair's health."
  }
];


  return (
    <section className=" max-w-4xl mx-auto font-bodonimoda">
      <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bodonimoda text-[#55203d] mb-10">
              <span className="border-t border-b border-gray-300 px-4 sm:px-6">
                Frequently Asked Questions
              </span>
            </h2>
          </div>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-xl p-6 border border-purple-100">
            <h4 className="text-lg font-semibold text-purplecolor">{faq.question}</h4>
            <p className="text-sm text-gray-700 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
