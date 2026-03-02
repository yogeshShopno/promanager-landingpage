import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Mail, Phone, MapPin, Clock, Check, Zap } from "lucide-react";
import { Helmet } from "@dr.pogodin/react-helmet";

const AnimatedCounter = ({ from, to, duration, symbol }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const start = performance.now();
      const animate = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const newCount = Math.floor(progress * (to - from) + from);
        setCount(newCount);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref}>
      {count}
      {symbol}
    </span>
  );
};

const ContactPage = () => {
  const faqData = [
    {
      question: "How quickly can we get set up on promanager?",
      answer: "Most organizations can get started within minutes. promanager offers a simple and guided setup process for payroll and attendance management.",
    },
    {
      question: "Do you provide customer support?",
      answer: "Yes! promanager provides dedicated customer support via chat, email, and phone to assist you at every step.",
    },
    {
      question: "Is there a free trial available?",
      answer: "Currently, promanager does not offer a free trial. However, our team is happy to provide a guided demo to help you understand the platform before getting started.",
    },
    {
      question: "Can promanager integrate with existing systems?",
      answer: "Yes, promanager supports seamless integration with various HR, attendance, and accounting systems to ensure smooth payroll operations.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Helmet>
        <title>Contact promanager | Book a Demo & Support</title>
        <meta name="description" content="Get in touch with promanager payroll experts. Book a demo, schedule a call, or reach our support team for payroll, HR, and compliance assistance." />
        <link rel="canonical" href="https://promanager.in/contact" />
      </Helmet>

      {/* Hero Section with Curved Design */}
      <div className="relative bg-[var(--color-blue)] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="space-y-8 z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="w-4 h-4" />
                Get in Touch
              </motion.span>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Let's Transform Your HR Together
              </motion.h1>

              <motion.p
                className="text-white text-lg md:text-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Book a personalized demo and discover how promanager can streamline your payroll, attendance, and workforce management.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className="bg-white text-[var(--color-blue)] px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule a Call
                </motion.button>
                <motion.button
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Email Us
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Contact Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {[
                { icon: Mail, label: "Email", value: "support@promanager.in", color: "from-blue-400 to-blue-600" },
                { icon: Phone, label: "Phone", value: "+91 1234567890", color: "from-green-400 to-green-600" },
                { icon: MapPin, label: "Location", value: "Mumbai, India", color: "from-purple-400 to-purple-600" },
                { icon: Clock, label: "Support", value: "24/7 Available", color: "from-orange-400 to-orange-600" },
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white/80 text-sm mb-1">{contact.label}</p>
                  <h3 className="text-white font-semibold text-base">{contact.value}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Contact Form Section with Curved Title */}
      <div className="bg-white py-20">
         <div className="absolute top-1/2 z-10   left-0 w-[400px] h-[500px] rounded-full
    bg-[#6c4cf1]
    blur-[90px]
    opacity-20
  "/>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* Curved Title Section */}
          <div className="relative mb-16">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block relative">
                <span className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
                  Book Your <span className="text-[var(--color-blue)]">Appointment</span>
                </span>
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                  className="absolute -bottom-2 left-0 w-72 h-4"
                  viewBox="0 0 290 12"
                  fill="none"
                >
                  <motion.path
                    d="M2 10C70 2, 150 2, 220 10C250 16, 270 10, 288 10"
                    stroke="var(--color-blue)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </div>
              <p className="text-[var(--color-text-secondary)] text-lg mt-6 max-w-2xl mx-auto">
                Schedule a personalized session and explore how our platform fits your HR needs
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-[var(--color-border)] bg-[var(--color-white)] shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Full Name</label>
                      <Input placeholder="Enter your first and last name" className="border-[var(--color-border)] bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Work Email Address</label>
                      <Input type="email" placeholder="We'll send the meeting link here" className="border-[var(--color-border)] bg-white" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Company Name</label>
                      <Input placeholder="Let us know where you're from" className="border-[var(--color-border)] bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Job Title / Role</label>
                      <Input placeholder="So we can tailor the session" className="border-[var(--color-border)] bg-white" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Number of Employees</label>
                      <Input placeholder="Helps us recommend the right plan" className="border-[var(--color-border)] bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Preferred Date & Time</label>
                      <Input placeholder="Choose your best time" className="border-[var(--color-border)] bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Additional Notes or Questions (Optional)</label>
                    <Textarea placeholder="Let us know what you'd like to discuss." rows={4} className="border-[var(--color-border)] bg-white" />
                  </div>

                  <motion.button
                    className="w-full bg-[var(--color-blue)] text-white py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Appointment
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section with Curved Background */}
      <div className="relative bg-white py-20 ">
        {/* Top Curve */}
       <div className="absolute top-1/2 z-10   right-0 w-[400px] h-[500px] rounded-full
    bg-[#6c4cf1]
    blur-[90px]
    opacity-20
  "/>

        <div className="relative max-w-5xl mx-auto px-4 md:px-8">
          {/* Curved Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block relative">
              <span className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)]">
                Frequently Asked <span className="text-[var(--color-blue)]">Questions</span>
              </span>
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                className="absolute -bottom-2 left-0 w-80 h-4"
                viewBox="0 0 320 12"
                fill="none"
              >
                <motion.path
                  d="M2 10C70 2, 150 2, 230 10C270 16, 300 10, 318 10"
                  stroke="var(--color-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </div>
            <p className="text-[var(--color-text-secondary)] text-lg mt-6">
              Quick answers to common questions about our platform
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[var(--color-blue)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--color-text-primary)] mb-2 text-lg">{faq.question}</h4>
                        <p className="text-[var(--color-text-secondary)] leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
