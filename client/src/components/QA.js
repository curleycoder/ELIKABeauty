import React from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "Do I need to book in advance?",
      answer: "Yes, we recommend booking at least 1-2 days in advance to secure your desired time slot."
    },
    {
      question: "Can I combine multiple services?",
      answer: "Absolutely! You can book multiple services and they’ll be scheduled back-to-back."
    },
    {
      question: "What payment methods do you accept?",
      answer: "You can pay via cash, e-transfer, or debit/credit card in person after your appointment."
    },
    {
      question: "What if I'm running late?",
      answer: "Please call us as soon as possible. We offer a 15-minute grace period before rescheduling may be necessary."
    },
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
