import React, { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "How long should I wait after balayage before doing a keratin treatment?",
      answer:
        "Ideally wait 10–14 days after balayage before a keratin treatment. This helps the colour settle and reduces the chance of overlapping chemical stress on the hair.",
    },
    {
      question: "Can I go blonde if my hair was previously dyed black, red, or with henna?",
      answer:
        "Sometimes, yes—but it depends on your hair history and current condition. Going blonde from dark dye or henna usually requires a colour-correction plan and may take multiple sessions to keep hair healthy.",
    },
    {
      question: "How do I maintain balayage or highlights between appointments?",
      answer:
        "Use a colour-safe shampoo, heat protection, and a weekly conditioning mask. Purple shampoo may help if you’re going lighter, and toner refreshes can keep the tone looking clean.",
    },
    {
      question: "How often should I come in for hair colour maintenance?",
      answer:
        "Most clients refresh every 6–10 weeks depending on the service. Balayage can last longer, while root coverage usually needs more frequent maintenance.",
    },
    {
      question: "What should I tell my stylist during the consultation?",
      answer:
        "Bring inspiration photos, tell me your hair history (box dye, henna, previous bleach), and how much maintenance you’re willing to do. That’s how we choose the right plan for your hair.",
    },
  ];

  // start closed (better UX)
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl text-[#55203d] mb-8">
            Frequently Asked Questions
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Quick answers to common questions about hair colour, balayage, and treatments.
        </p>
      </div>

      <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = idx === openIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              className="w-full text-left px-6 sm:px-8 py-5 focus:outline-none"
            >
              <div className="flex items-start justify-between gap-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#55203d]">
                  {faq.question}
                </h3>
                <span
                  className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-[#55203d] transition ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </div>

              {isOpen && (
                <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl">
                  {faq.answer}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
