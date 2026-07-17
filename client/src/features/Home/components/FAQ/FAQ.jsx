import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
    {
        question: "How do I place an order on Zarkhaiz?",
        answer:
            "Browse products from Featured Crops or Shop by Categories, open a product, and click Add to Cart. You can review your cart and place the order directly from there.",
    },
    {
        question: "Are all farmers and sellers verified?",
        answer:
            "Yes. Every farmer and seller on Zarkhaiz goes through a verification process to confirm their identity and the quality of the products they list.",
    },
    {
        question: "What payment methods are supported?",
        answer:
            "We support secure online payments as well as cash on delivery, so you can choose whichever option works best for you.",
    },
    {
        question: "How long does delivery take?",
        answer:
            "Delivery time depends on your city and the seller's location, but most orders are delivered within 2 to 5 business days.",
    },
    {
        question: "How can I become a seller on Zarkhaiz?",
        answer:
            "Click the Become Seller button on the homepage, fill in your details, and submit your application. Our team will verify and approve your account.",
    },
    {
        question: "Can I return a product if I'm not satisfied?",
        answer:
            "Yes, most products are eligible for return within a limited window if they don't meet the listed quality. Check the product page for specific return terms.",
    },
];

function FaqItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-4
                    p-5
                    sm:p-6
                    text-left
                "
            >
                <span className="font-semibold text-gray-900 text-base">
                    {question}
                </span>

                <ChevronDown
                    size={20}
                    className={`
                        flex-shrink-0
                        text-green-700
                        transition-transform
                        duration-200
                        ${isOpen ? "rotate-180" : "rotate-0"}
                    `}
                />
            </button>

            <div
                className={`
                    grid
                    transition-all
                    duration-200
                    ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                `}
            >
                <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-600 leading-relaxed">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex((current) => (current === index ? null : index));
    };

    return (
        <section className="px-4 sm:px-6 lg:px-10 py-10">
            <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 mb-8">
                <HelpCircle size={20} className="text-green-600" />
                Frequently Asked Questions
                <HelpCircle size={20} className="text-green-600" />
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
                {FAQS.map((faq, index) => (
                    <FaqItem
                        key={faq.question}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
            </div>
        </section>
    );
}