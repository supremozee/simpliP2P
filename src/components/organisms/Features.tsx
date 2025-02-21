import React from 'react';
import { motion } from 'framer-motion';
import { 
  IoDocumentText, 
  IoWallet, 
  IoAnalytics, 
  IoShield, 
  IoPeople, 
  IoCloud 
} from 'react-icons/io5';

const features = [
  {
    icon: IoDocumentText,
    title: 'Smart Document Processing',
    description: 'Automate document processing with AI-powered OCR and intelligent data extraction.'
  },
  {
    icon: IoWallet,
    title: 'Cost Management',
    description: 'Track and optimize spending with real-time budget monitoring and cost analysis tools.'
  },
  {
    icon: IoAnalytics,
    title: 'Performance Analytics',
    description: 'Gain insights with comprehensive dashboards and customizable reports.'
  },
  {
    icon: IoShield,
    title: 'Compliance Management',
    description: 'Ensure regulatory compliance with automated checks and audit trails.'
  },
  {
    icon: IoPeople,
    title: 'Supplier Network',
    description: 'Connect with verified suppliers and manage relationships effectively.'
  },
  {
    icon: IoCloud,
    title: 'Cloud Integration',
    description: 'Seamlessly integrate with your existing systems and cloud services.'
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Modern Procurement
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Streamline your procurement process with our comprehensive suite of features 
            designed to save time, reduce costs, and improve efficiency.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur rounded-xl p-8 hover:bg-gray-800/70 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 