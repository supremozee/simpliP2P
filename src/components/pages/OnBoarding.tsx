import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';
import FAQ from '../organisms/FAQ';
import Image from 'next/image';

const OnBoarding = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Text Section */}
          <div className="relative mb-20 rounded-[32px] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
            <div className="relative text-center max-w-4xl mx-auto py-16 px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-bold text-gray-900 mb-6"
              >
                Seamless & Secure P2P Transactions – Anytime, Anywhere!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 mb-8"
              >
                Connect, trade, and lend with confidence on SimpliP2P – your trusted peer-to-peer marketplace
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 justify-center"
              >
                <Button
                  onClick={handleGetStarted}
                  className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90"
                >
                  Get Started
                </Button>
                <Button
                  onClick={handleHowItWorks}
                  className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:bg-gray-50"
                >
                  How It Works
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative h-[500px] rounded-[32px] overflow-hidden shadow-2xl"
          >
            <Image
              src="/dashboard.png"
              alt="Dashboard Preview"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Main Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Getting Started is Easy!</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <div className="space-y-12">
              {[
                {
                  title: "Create an Account",
                  step: "Step 1",
                  description: "Sign up in minutes and verify your identity for a secure experience"
                },
                {
                  title: "Find & Connect",
                  step: "Step 2",
                  description: "Browse listings, post offers, or find trusted peers to transact with"
                },
                {
                  title: "Complete Transactions Securely",
                  step: "Step 3",
                  description: "Use our built-in escrow and rating system for safe, reliable exchanges"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-8 rounded-[32px] shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-primary font-medium mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 relative">
                    {item.title}
                    <div className="absolute bottom-0 left-0 w-16 h-1 bg-primary" />
                  </h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-[32px] overflow-hidden shadow-xl"
            >
              <Image
                src="/how.png"
                alt="How It Works"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Demo Request Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h2>
              <p className="text-xl text-gray-600">
                See how our platform can transform your P2P transactions
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <form className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="submit"
                    className="w-full bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90"
                  >
                    Request Demo
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};

export default OnBoarding;