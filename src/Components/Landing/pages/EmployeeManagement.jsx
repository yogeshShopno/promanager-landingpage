import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import CoreFeaturesSection from "../components/CoreFeaturesSection";
import { Helmet } from "@dr.pogodin/react-helmet";

// Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 },
    },
};

// Reusable Components
const StatCard = ({ children, className }) => (
    <motion.div
        className={`rounded-2xl p-6 shadow-lg ${className}`}
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
        {children}
    </motion.div>
);

const BenefitItem = ({ text, index }) => (
    <motion.div
        className="flex items-start space-x-3"
        variants={itemVariants}
        transition={{ delay: 0.7 + index * 0.1 }}
        whileHover={{ x: 3 }}
    >
        <motion.div
            className="w-5 h-5 bg-[var(--color-blue)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.8 + index * 0.1 }}
            viewport={{ once: true }}
        >
            <Check className="w-3 h-3 text-[var(--color-text-white)]" />
        </motion.div>
        <p className="text-[var(--color-text-primary)] text-sm leading-relaxed">{text}</p>
    </motion.div>
);

const EmployeeManagement = () => {
    const benefits = [
        "Keep all employee information organized, accessible, and secure in one single platform.",
        "Streamlined HR processes reduce manual tasks and free up time for strategic work.",
        "Real-time monitoring ensures transparency and minimizes payroll errors.",
        "Maintain regulatory compliance with built-in permission controls and audit trails.",
        "Self-service access empowers employees and builds trust through process transparency.",
        "Automated workflows ensure smoother transitions and better first and last impressions.",
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* ✅ Helmet for SEO */}
            <Helmet>
                <title>Employee Management Software | promanager Payroll & HR</title>
                <meta
                    name="description"
                    content="promanager Employee Management Software helps businesses streamline HR, payroll, attendance, compliance, and workforce operations with ease and accuracy."
                />
                <link rel="canonical" href="https://promanager.in/employee-management" />
                <meta
                    name="keywords"
                    content="Employee Management, promanager, Payroll Software, HR Platform, Workforce Management, SaaS HR Software"
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="promanager" />
                <meta property="og:title" content="Employee Management Software | promanager" />
                <meta
                    property="og:description"
                    content="Manage payroll, attendance, compliance, and HR with promanager Employee Management Software. Trusted by modern businesses for accuracy and automation."
                />
                <meta property="og:url" content="https://promanager.in/employee-management" />
                <meta property="og:image" content="https://promanager.in/logo.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@promanager" />
                <meta name="twitter:title" content="Employee Management Software | promanager" />
                <meta
                    name="twitter:description"
                    content="Discover promanager Employee Management Software – automate HR, payroll, compliance, and workforce management for modern businesses."
                />
                <meta name="twitter:image" content="https://promanager.in/logo.png" />
            </Helmet>
            {/* ================= Hero Section ================= */}
            <div className="bg-[var(--color-white)]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.span
                            className="inline-block bg-[var(--color-accent-yellow)] text-[var(--color-text-primary)] px-4 py-2 rounded-full text-sm font-medium"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            Payroll & HR Simplified
                        </motion.span>

                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Streamline Payroll & Workforce Management
                            <br />
                            <span className="text-[var(--color-blue)]">with promanager</span>
                        </motion.h1>

                        <motion.p
                            className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            Manage everything from{" "}
                            <strong>attendance and leave tracking</strong> to{" "}
                            <strong>payroll, compliance, and employee insights</strong> — all in one
                            secure, scalable, and intuitive platform built for modern businesses.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <motion.button
                                className="bg-[var(--color-blue)] text-[var(--color-text-white)] px-8 py-4 rounded-full font-medium hover:bg-[var(--color-blue-dark)] transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started
                            </motion.button>
                            <motion.button
                                className="border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] px-8 py-4 rounded-full font-medium hover:border-[var(--color-blue)] hover:text-[var(--color-blue)] transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Explore Features
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* Right Visuals */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="grid grid-cols-2 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Images + Stats */}
                            <motion.div
                                className="aspect-square rounded-2xl overflow-hidden shadow-lg"
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, rotate: 1 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80"
                                    alt="Team collaboration"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* Active Users Card */}
                            <StatCard className="bg-[var(--color-white)] border border-[var(--color-border)] flex flex-col items-center justify-center text-center gap-2 p-6 hover:shadow-xl transition-shadow">
                                <div className="text-4xl font-extrabold text-[var(--color-blue)]">10,000+</div>
                                <div className="text-base font-semibold text-[var(--color-text-primary)]">
                                    Active Users
                                </div>
                                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                    Trusted daily by professionals worldwide
                                </p>
                            </StatCard>

                            {/* Efficiency Card */}
                            <StatCard className="relative bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] flex flex-col items-center justify-center text-center gap-2 p-6 hover:shadow-xl transition-shadow overflow-hidden">
                                {/* Decorative background accent */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                                <div className="text-4xl text-[var(--color-text-white)] font-extrabold relative z-10">85%</div>
                                <div className="text-base text-[var(--color-text-white)] font-semibold relative z-10">
                                    Higher Efficiency
                                </div>
                                <p className="text-sm text-[var(--color-text-white)] relative z-10 leading-relaxed">
                                    Boost in payroll & HR efficiency
                                </p>
                            </StatCard>


                            <motion.div
                                className="aspect-square rounded-2xl overflow-hidden shadow-lg"
                                variants={cardVariants}
                                whileHover={{ scale: 1.02, rotate: -1 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                                    alt="Professional woman working"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ================= Benefits Section ================= */}
            <div className="bg-[var(--color-bg-primary)] py-16">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <motion.div
                        className="bg-[var(--color-white)] rounded-3xl shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Image */}
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                                    alt="Team meeting"
                                    className="w-full h-full object-cover min-h-[400px] sm:min-h-[500px]"
                                />
                                {/* Success Badge */}
                                <motion.div
                                    className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-[var(--color-white)] rounded-xl p-4 shadow-lg max-w-xs"
                                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-[var(--color-green)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <Check className="w-4 h-4 text-[var(--color-text-white)]" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--color-text-white)] text-sm mb-1">
                                                Committed to Your Long-Term Success
                                            </h4>
                                            <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">
                                                Reliable support, continuous updates, and tools that grow with your business.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Right Content */}
                            <motion.div
                                className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <div className="space-y-6">
                                    <span className="text-sm text-[var(--color-blue)] font-medium">
                                        Why Employee Management Matters
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
                                        Efficient Employee Management Drives Team Success
                                    </h2>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                        Centralized systems improve accuracy, engagement, and streamline HR
                                        operations across every department. Modern businesses need tools that
                                        enhance productivity and employee satisfaction.
                                    </p>
                                    <motion.div
                                        className="space-y-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                    >
                                        {benefits.map((benefit, i) => (
                                            <BenefitItem key={i} text={benefit} index={i} />
                                        ))}
                                    </motion.div>
                                    <motion.button
                                        className="bg-[var(--color-blue)] text-[var(--color-text-white)] px-8 py-3 rounded-full font-medium hover:bg-[var(--color-blue-dark)] transition-colors inline-block"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Explore Features
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ================= Core Features ================= */}
            <CoreFeaturesSection />
        </div>
    );
};

export default EmployeeManagement;
