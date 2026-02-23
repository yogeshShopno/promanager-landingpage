import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Free 30-day trial",
  "No setup fees",
  "24/7 support",
  "GDPR compliant"
];

const CTASection = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-[#6C4CF1] via-[#5b3dd9] to-[#4B2EDB] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title with Curved Line */}
          <div className="relative inline-block mb-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xl lg:text-2xl font-bold"
            >
              Start Your Journey Today
            </motion.h3>
            
            {/* Curved Line SVG */}
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              className="absolute top-8 left-1/2 -translate-x-1/2 w-56 h-4"
              viewBox="0 0 220 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M2 10C50 2, 100 2, 150 10C180 16, 200 10, 218 10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.6"
              />
            </motion.svg>
          </div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl lg:text-5xl font-extrabold mb-6 leading-tight"
          >
            Ready to Transform Your{" "}
            <span className="text-white/90">Payroll Operations?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/80 max-w-2xl mx-auto mb-8"
          >
            Join thousands of companies using ProManager to streamline workforce management.
            Start your free trial today.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-white/90 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#6C4CF1] font-bold rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              Schedule Demo
            </motion.button>
          </motion.div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-white/70 text-sm"
          >
            No credit card required • Setup in 5 minutes
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
