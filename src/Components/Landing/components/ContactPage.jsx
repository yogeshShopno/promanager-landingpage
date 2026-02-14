import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ArrowRight } from "lucide-react";
import { Helmet } from "@dr.pogodin/react-helmet";

// Images
const mainCollaborationImage =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const womanLaptopImage =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop";

const faqData = [
  {
    question: "How quickly can we get set up on promanager?",
    answer:
      "Most organizations can get started within minutes. promanager offers a simple and guided setup process for payroll and attendance management.",
  },
  {
    question: "Do you provide customer support?",
    answer:
      "Yes! promanager provides dedicated customer support via chat, email, and phone to assist you at every step.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Currently, promanager does not offer a free trial. However, our team is happy to provide a guided demo to help you understand the platform before getting started.",
  },
  {
    question: "Can promanager integrate with existing systems?",
    answer:
      "Yes, promanager supports seamless integration with various HR, attendance, and accounting systems to ensure smooth payroll operations.",
  },
];


// Animated Counter Component
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
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Helmet>
        <title>Contact promanager | Book a Demo & Support</title>
        <meta
          name="description"
          content="Get in touch with promanager payroll experts. Book a demo, schedule a call, or reach our support team for payroll, HR, and compliance assistance."
        />
        <link rel="canonical" href="https://promanager.in/contact" />
        <meta
          name="keywords"
          content="Contact promanager, promanager Support, Payroll Software Contact, Book Demo, HR Software Help, promanager Sales"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="promanager" />
        <meta property="og:title" content="Contact promanager | Book a Demo & Support" />
        <meta
          property="og:description"
          content="Book a personalized demo or contact promanager support for payroll, HR, and compliance solutions."
        />
        <meta property="og:url" content="https://promanager.in/contact" />
        <meta property="og:image" content="https://promanager.in/logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@promanager" />
        <meta name="twitter:title" content="Contact promanager | Book a Demo & Support" />
        <meta
          name="twitter:description"
          content="Connect with promanager for payroll automation and HR software. Book a call or talk to support."
        />
        <meta name="twitter:image" content="https://promanager.in/logo.png" />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 lg:py-32 bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-block px-4 py-2 bg-[var(--color-cell-l-bg)] text-[var(--color-cell-l-text)] text-xs sm:text-sm font-medium rounded-full mb-6">
                  All-in-One Efficiency
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-[var(--color-text-primary)]"
                >
                  Optimize Workforce Management with{" "}
                  <span className="text-[var(--color-text-primary)]">
                    promanager
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl"
                >
                  Simplify every aspect of HR — from recruitment and onboarding
                  to payroll, performance reviews, and employee analytics — with
                  a secure, scalable, and user-friendly cloud platform built for
                  modern teams and businesses
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="bg-[var(--color-blue-darker)] text-[var(--color-text-white)] px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[var(--color-blue-dark)] transition-colors group text-base sm:text-lg">
                    Get Started Now
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-base sm:text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>

              {/* Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
              >
                {/* Main Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 z-5 w-64 sm:w-80 md:w-96 h-56 sm:h-72 md:h-80 overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl"
                >
                  <img
                    src={mainCollaborationImage}
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Active Users */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="absolute top-4 sm:top-8 right-2 sm:right-0 z-10 bg-[var(--color-bg-card)] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl w-56 sm:w-72"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                      <AnimatedCounter
                        from={0}
                        to={10}
                        duration={1500}
                        symbol=",000+"
                      />
                    </h3>
                    <p className="font-semibold text-[var(--color-text-primary)] text-base sm:text-lg">
                      Active Users
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Companies across industries rely on our platform to manage
                      their HR operations daily
                    </p>
                  </div>
                </motion.div>

                {/* Woman Image */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute bottom-8 sm:bottom-16 right-4 sm:right-8 z-5 w-56 sm:w-72 h-64 sm:h-80 overflow-hidden rounded-xl sm:rounded-3xl shadow-2xl"
                >
                  <img
                    src={womanLaptopImage}
                    alt="Professional woman"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Customer Satisfaction */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  viewport={{ once: true }}
                  className="absolute bottom-6 sm:bottom-12 left-6 sm:left-20 z-10 bg-[var(--color-blue-darker)] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl text-[var(--color-text-white)] w-56 sm:w-72"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                      98%
                    </h3>
                    <p className="font-semibold mb-1 text-base sm:text-lg">
                      Customer Satisfaction
                    </p>
                    <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
                      Our clients love our intuitive interface, responsive
                      support, and continuous feature updates
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Book Appointment Section */}
        <section className="py-16 md:py-20 bg-[var(--color-bg-secondary)]">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <p className="text-xs sm:text-sm font-medium text-[var(--color-blue-dark)] tracking-wide uppercase">
                Book Appointment
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                Schedule a Call to Transform Your HR Today
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Book a personalized session and explore how our platform fits
                your HR needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="w-full border-[var(--color-border-secondary)] bg-[var(--color-bg-card)] shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <div className="space-y-6">
                    {/* Form Rows */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="fullName"
                          className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          Full Name
                        </label>
                        <Input
                          id="fullName"
                          placeholder="Enter your first and last name"
                          className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="workEmail"
                          className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          Work Email Address
                        </label>
                        <Input
                          id="workEmail"
                          type="email"
                          placeholder="We'll send the meeting link here"
                          className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="companyName"
                          className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          Company Name
                        </label>
                        <Input
                          id="companyName"
                          placeholder="Let us know where you're from"
                          className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="jobTitle"
                          className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          Job Title / Role
                        </label>
                        <Input
                          id="jobTitle"
                          placeholder="So we can tailor the session"
                          className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="employeeCount"
                          className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          Number of Employees
                        </label>
                        <Input
                          id="employeeCount"
                          placeholder="Helps us recommend the right plan"
                          className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="preferredTime"
                          className="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          Preferred Date & Time
                        </label>
                        <Input
                          id="preferredTime"
                          placeholder="Choose your best time"
                          className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="additionalNotes"
                        className="text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Additional Notes or Questions (Optional)
                      </label>
                      <Textarea
                        id="additionalNotes"
                        placeholder="Let us know what you'd like to discuss."
                        rows={4}
                        className="border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-4"
                    >
                      <Button className="w-full bg-[var(--color-blue-darker)] text-[var(--color-text-white)] py-3 sm:py-4 text-base sm:text-lg rounded-lg hover:bg-[var(--color-blue-dark)] transition-colors group">
                        Book Appointment
                        <motion.div
                          className="ml-2"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-[var(--color-bg-primary)]">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Quick answers to common questions about our platform
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Card className="border-[var(--color-border-secondary)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-secondary)] transition-all duration-300 shadow-md">
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="font-semibold text-[var(--color-text-primary)] mb-2 text-base sm:text-lg">
                        {faq.question}
                      </h4>
                      <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
