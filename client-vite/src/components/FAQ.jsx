import { useState } from "react";

const faqs = [
  {
    question: "How long should I wait after balayage before doing a keratin treatment?",
    answer: "Ideally wait 10–14 days after balayage before a keratin treatment. This helps the colour settle and reduces the chance of overlapping chemical stress on the hair.",
  },
  {
    question: "Can I go blonde if my hair was previously dyed black, red, or with henna?",
    answer: "Sometimes, yes — but it depends on your hair history and current condition. Going blonde from dark dye or henna usually requires a colour-correction plan and may take multiple sessions to keep hair healthy.",
  },
  {
    question: "How do I maintain balayage or highlights between appointments?",
    answer: "Use a colour-safe shampoo, heat protection, and a weekly conditioning mask. Purple shampoo helps if you're going lighter, and toner refreshes keep the tone looking clean.",
  },
  {
    question: "How often should I come in for hair colour maintenance?",
    answer: "Most clients refresh every 6–10 weeks depending on the service. Balayage can last longer, while root coverage usually needs more frequent maintenance.",
  },
  {
    question: "What should I tell my stylist during the consultation?",
    answer: "Bring inspiration photos, share your hair history (box dye, henna, previous bleach), and how much maintenance you're willing to do. That's how we choose the right plan for your hair.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-[#8a6b73] mb-2">Have questions?</p>
        <h2 className="text-2xl sm:text-3xl font-theseason text-[#572a31]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = idx === openIndex;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-[#572a31]/30 bg-[#fcfaf8]"
                  : "border-[#572a31]/10 bg-white hover:border-[#572a31]/20"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-semibold text-[#3D0007] text-sm sm:text-base leading-snug">
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#572a31] border border-[#572a31]/20 transition-transform duration-200 ${
                    isOpen ? "rotate-45 bg-[#572a31] text-white border-[#572a31]" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
              </button>

              {isOpen && (
                <p className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
