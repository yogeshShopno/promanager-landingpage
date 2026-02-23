import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, BarChart3, Shield, Zap } from "lucide-react";
import { Helmet } from "@dr.pogodin/react-helmet";

const benefits = [
  {
    icon: DollarSign,
    title: "Accurate Payroll Processing",
    description: "Eliminate manual errors with automated salary calculations, tax deductions, and compliance-ready reports."
  },
  {
    icon: Calendar,
    title: "Leave & Attendance Integration",
    description: "Sync employee attendance and leave records directly into payroll for seamless payouts every cycle."
  },
  {
    icon: BarChart3,
    title: "Real-Time Insights & Analytics",
    description: "Access dashboards and reports to track payroll expenses, employee costs, and financial trends instantly."
  },
  {
    icon: Shield,
    title: "Compliance & Data Security",
    description: "Stay compliant with statutory regulations while ensuring sensitive employee payroll data remains secure."
  },
  {
    icon: Users,
    title: "Employee Self-Service",
    description: "Enable employees to view payslips, tax documents, and payroll history anytime through a secure portal."
  },
  {
    icon: Zap,
    title: "Faster & Scalable Operations",
    description: "Process payroll in minutes and scale effortlessly as your workforce grows, without added complexity."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-10 lg:py-10 bg-gradient-to-b from-[var(--color-bg-primary)] to-white relative overflow-hidden">
      <Helmet>
        <title>Payroll Software Features | promanager</title>
        <meta
          name="description"
          content="Explore promanager payroll software features: automated salary processing, compliance-ready payroll, real-time insights, employee self-service, and secure HR operations."
        />
        <link rel="canonical" href="https://promanager.in/features" />
      </Helmet>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6C4CF1]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#4B2EDB]/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Benefits Title with Curved Line */}
          <div className="relative inline-block mb-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)]"
            >
              Benefits
            </motion.h3>
            
            {/* Curved Line SVG */}
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-4"
              viewBox="0 0 130 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M2 10C30 2, 60 2, 90 10C105 16, 115 10, 128 10"
                stroke="url(#gradient-benefits)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient-benefits" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6C4CF1" />
                  <stop offset="100%" stopColor="#4B2EDB" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6"
          >
            Smarter Payroll,{" "}
            <span className="bg-gradient-to-r from-[#6C4CF1] to-[#4B2EDB] bg-clip-text text-transparent">
              Better Business Outcomes
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto"
          >
            Drive efficiency, compliance, and employee satisfaction with intelligent, automated payroll management tools.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Column - Benefits 1-3 */}
          <div className="space-y-10">
            {benefits.slice(0, 3).map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6C4CF1] to-[#4B2EDB] rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                        <div className="absolute inset-0.5 bg-white rounded-2xl flex items-center justify-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#6C4CF1] to-[#4B2EDB] rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[#6C4CF1] transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center Column - Image */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Decorative Elements */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#6C4CF1]/30 to-transparent rounded-full blur-2xl"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#4B2EDB]/30 to-transparent rounded-full blur-2xl"
              />

              {/* Main Image */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.4 }}
                className="relative h-96  "
              >
                <img
                  src="../../../../public/images/Smarter-Payroll.png"
                  alt="Payroll Dashboard"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Floating Shapes */}
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -right-8 w-6 h-6 bg-gradient-to-br from-[#6C4CF1] to-[#4B2EDB] rounded opacity-70"
              />
              <motion.div
                animate={{ y: [5, -5, 5], x: [-2, 2, -2] }}
                transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 -left-6 w-4 h-4 bg-gradient-to-br from-[#4B2EDB] to-[#6C4CF1] rounded opacity-70"
              />
            </div>
          </motion.div>

          {/* Right Column - Benefits 4-6 */}
          <div className="space-y-10">
            {benefits.slice(3, 6).map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index + 3}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6C4CF1] to-[#4B2EDB] rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                        <div className="absolute inset-0.5 bg-white rounded-2xl flex items-center justify-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#6C4CF1] to-[#4B2EDB] rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[#6C4CF1] transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
