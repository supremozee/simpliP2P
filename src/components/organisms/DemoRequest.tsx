import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { IoCheckmarkCircle } from 'react-icons/io5';

const benefits = [
  'Personalized platform walkthrough',
  'Custom implementation strategy',
  'ROI calculation',
  'Security overview',
  'Integration possibilities',
  'Pricing consultation'
];

const DemoRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccess(true);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 bg-gray-900" id="request-demo">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Request a Demo
            </h2>
            <p className="text-gray-400 mb-8">
              See how our platform can transform your procurement process. 
              Fill out the form and we&apos;ll get in touch within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  label="Work Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="company"
                  type="text"
                  label="Company Name"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your needs..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {loading ? 'Sending...' : success ? 'Request Sent!' : 'Request Demo'}
              </Button>
            </form>
          </motion.div>

          {/* Right Column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">
                What&apos;s Included in the Demo
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <IoCheckmarkCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-700/50 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-2">
                  Why Request a Demo?
                </h4>
                <p className="text-gray-400">
                  Get a personalized walkthrough of our platform tailored to your organization&apos;s needs. 
                  Our experts will show you how to maximize ROI and streamline your procurement process.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoRequest; 