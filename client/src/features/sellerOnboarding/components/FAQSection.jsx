import { useState } from "react";
import FAQItem from "./FAQItem";

const faqs = [
  {
    question: "How can I become a seller?",
    answer: "Click Register as Seller, complete the five-step application, and submit your business and identity details for verification.",
  },
  {
    question: "How long does verification take?",
    answer: "Verification time depends on the accuracy of your information and documents. Complete and clear submissions are reviewed more quickly.",
  },
  {
    question: "How do I receive payments?",
    answer: "During registration, you provide your bank or supported wallet details. Approved payment information is then used for seller settlements.",
  },
  {
    question: "Can I edit products later?",
    answer: "Yes. After approval, your seller dashboard lets you manage product details, pricing, stock, images, and availability.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#4b8b43]">Questions answered</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f1b] sm:text-4xl">Seller FAQ</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Everything you need to know before opening your store on Zarkhaiz Pakistan.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              {...faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
