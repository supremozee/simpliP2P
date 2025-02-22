import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <Image
              src="/dashboard-preview-2.png"
              alt="Procurement Overview"
              width={1200}
              height={600}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-20" />
          </div>
        </motion.div>

        {/* Success Stories */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Success Stories from Our Users
            </h2>
            <p className="text-xl text-gray-400">
              See what our customers are saying about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700" />
                  <div>
                    <h3 className="text-white font-medium">John Smith</h3>
                    <p className="text-gray-400 text-sm">Procurement Manager</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  The platform has streamlined our procurement process significantly. 
                  We&apos;ve seen remarkable improvements in efficiency.
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src="/cta-background.jpg"
              alt="CTA Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
          </div>
          
          <div className="relative z-10 p-12 md:p-24 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl">
              Join thousands of users making secure and seamless peer-to-peer exchanges
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-xl hover:bg-gray-100 transition-all font-medium">
              Get Started
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 