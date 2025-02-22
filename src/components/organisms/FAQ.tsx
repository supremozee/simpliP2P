import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDown } from 'react-icons/io5';
import Image from 'next/image';

const faqs = [
  {
    question: "What is simpliP2P?",
    answer: "simpliP2P is a comprehensive procurement platform that streamlines the purchasing process for businesses. It offers automated workflows, vendor management, and real-time tracking of procurement activities."
  },
  {
    question: "How secure is the platform?",
    answer: "Our platform employs industry-standard encryption and security measures. We regularly conduct security audits and maintain strict data protection protocols to ensure your procurement data remains safe and confidential."
  },
  {
    question: "Can I integrate simpliP2P with my existing systems?",
    answer: "Yes, simpliP2P is designed to integrate seamlessly with most common ERP systems, accounting software, and other business tools. Our team can assist you with custom integrations if needed."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide 24/7 customer support through multiple channels including email, phone, and live chat. Our dedicated support team is always ready to assist you with any questions or technical issues."
  },
  {
    question: "How do I get started?",
    answer: "Getting started is easy! Simply sign up for a free demo, and our team will guide you through the setup process. We'll help you customize the platform to match your procurement needs and provide training for your team."
  }
];

const successStories = [
  {
    name: "Sarah Johnson",
    role: "Procurement Manager",
    company: "Tech Solutions Inc.",
    image: "/success/1.jpg",
    quote: "SimpliP2P has revolutionized our procurement process. We've reduced processing time by 60% and improved vendor relationships significantly."
  },
  {
    name: "Michael Chen",
    role: "Operations Director",
    company: "Global Logistics Ltd.",
    image: "/success/2.jpg",
    quote: "The platform's integration capabilities and real-time tracking have made our operations much more efficient. Excellent support team too!"
  },
  {
    name: "Emily Rodriguez",
    role: "Supply Chain Head",
    company: "Retail Dynamics",
    image: "/success/3.jpg",
    quote: "We've seen a remarkable improvement in our procurement efficiency since implementing SimpliP2P. The ROI has been outstanding."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Success Stories Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how SimpliP2P has transformed procurement processes for businesses worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={story.image}
                      alt={story.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.role}</p>
                    <p className="text-sm text-gray-500">{story.company}</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">
                  &quot;{story.quote}&quot;
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/faq-illustration.jpg"
                  alt="FAQ Illustration"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                <p className="text-gray-600">
                  Can&apos;t find the answer you&apos;re looking for? Please chat with our friendly team.
                </p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Find answers to common questions about simpliP2P and how it can transform your procurement process.
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <span className="text-left font-medium text-gray-900">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IoChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-white border-t border-gray-100 rounded-b-xl">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 