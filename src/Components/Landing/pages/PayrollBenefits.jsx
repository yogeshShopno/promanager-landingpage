import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Award } from 'lucide-react';
import AccordionDemo from '../components/Accordian';
import { Helmet } from "@dr.pogodin/react-helmet";

const PayrollBenefits = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const scaleHover = {
        scale: 1.05,
        transition: { duration: 0.3 }
    };

    const buttonHover = {
        scale: 1.05,
        transition: { duration: 0.2 }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] p-4 sm:p-6 overflow-x-hidden">
            {/* ✅ Helmet for SEO */}
            <Helmet>
                <title>Payroll & Benefits Software | promanager</title>
                <meta
                    name="description"
                    content="Discover promanager Payroll & Benefits Software – automate salary disbursement, compliance, tax, and employee perks. Build trust and boost retention."
                />
                <link rel="canonical" href="https://promanager.com/payroll-benefits" />
                <meta
                    name="keywords"
                    content="Payroll Benefits, Payroll Software, promanager, Salary Automation, Employee Benefits, Compliance Software, HR SaaS"
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="promanager" />
                <meta property="og:title" content="Payroll & Benefits Software | promanager" />
                <meta
                    property="og:description"
                    content="promanager helps businesses with payroll automation, benefits management, and compliance – making employees happier and businesses more efficient."
                />
                <meta property="og:url" content="https://promanager.com/payroll-benefits" />
                <meta property="og:image" content="https://promanager.com/logo.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@promanager" />
                <meta name="twitter:title" content="Payroll & Benefits Software | promanager" />
                <meta
                    name="twitter:description"
                    content="Simplify payroll, compliance, and employee benefits with promanager. The SaaS solution for modern HR."
                />
                <meta name="twitter:image" content="https://promanager.com/logo.png" />
            </Helmet>
            {/* First Section - Workforce Management */}
            <motion.div
                className="max-w-7xl mx-auto mb-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Content */}
                    <div className="space-y-8">
                        {/* Main Hero Card */}
                        <motion.div
                            className="bg-[var(--color-blue-dark)] rounded-3xl p-6 sm:p-8 text-[var(--color-text-white)] w-full max-w-full lg:max-w-[616px] h-auto lg:h-[516px] mx-auto"
                            variants={itemVariants}
                            whileHover={scaleHover}
                        >
                            <motion.div
                                className="mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <span className="bg-[var(--color-blue)] px-3 py-1 rounded-full text-sm font-medium">
                                    All-in-One Efficiency
                                </span>
                            </motion.div>
                            <motion.h1
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                Optimize Workforce<br />
                                Management with<br />
                                HR Solutions
                            </motion.h1>
                            <motion.p
                                className="text-base sm:text-lg mb-8 text-[var(--color-text-white)] leading-relaxed max-w-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                            >
                                Simplify every aspect of HR — from recruitment and onboarding to payroll,
                                performance reviews, and employee analytics — with a secure, scalable, and user-
                                friendly cloud platform built for modern teams and businesses
                            </motion.p>
                            <motion.div
                                className="flex flex-wrap gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.8 }}
                            >
                                <motion.button
                                    className="bg-[var(--color-blue-darker)] text-[var(--color-text-white)] px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-blue-darker)] transition-colors"
                                    whileHover={buttonHover}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started Now
                                </motion.button>
                                <motion.button
                                    className="border-2 border-[var(--color-blue)] text-[var(--color-text-white)] px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-blue)] transition-colors"
                                    whileHover={buttonHover}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Learn More
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Bottom Stats Cards */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-6 w-full"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-lg flex-1 w-full h-auto"
                                whileHover={scaleHover}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3, duration: 0.8 }}
                            >
                                <motion.div
                                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-3"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
                                >
                                    10,000+
                                </motion.div>
                                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-3">Active Users</h3>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base">
                                    Companies across industries rely on our platform
                                    to manage their HR operations daily
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-[var(--color-bg-gray-light)] rounded-2xl p-2 flex-1 w-full h-52 sm:h-60"
                                whileHover={scaleHover}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.4, duration: 0.8 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1560264280-88b68371db39"
                                    alt="Team working together"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        className="relative w-full max-w-full lg:max-w-[616px] h-auto lg:h-[516px] mx-auto"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="bg-[var(--color-bg-secondary)] rounded-3xl shadow-2xl overflow-hidden h-full"
                            whileHover={scaleHover}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1590650046871-92c887180603"
                                alt="Two professionals collaborating"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        <motion.div
                            className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-2xl p-6 sm:p-10 shadow-lg mt-8 w-full h-52 sm:h-60"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            whileHover={scaleHover}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-white)]">Clients across industries</h3>
                                <motion.div
                                    className="flex -space-x-2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.6, duration: 0.6 }}
                                >
                                    {[
                                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
                                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                                    ].map((src, index) => (
                                        <motion.img
                                            key={index}
                                            src={src}
                                            alt={`client${index + 1}`}
                                            className="w-8 h-8 rounded-full border-2 border-[var(--color-bg-secondary)]"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 1.8 + index * 0.1, duration: 0.4 }}
                                            whileHover={{ scale: 1.2 }}
                                        />
                                    ))}
                                    <motion.div
                                        className="w-8 h-8 bg-[var(--color-blue-darker)] rounded-full border-2 border-[var(--color-bg-secondary)] flex items-center justify-center text-xs text-[var(--color-text-white)] font-bold"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 2.1, duration: 0.4 }}
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        80+
                                    </motion.div>
                                </motion.div>
                            </div>
                            <p className="text-[var(--color-text-white)] text-sm mb-4">
                                Many of our clients report faster hiring processes
                                and better employee engagement after switching
                                to our system.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Second Section - Payroll Benefits */}
            <motion.div
                className="max-w-7xl mx-auto mt-20 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[var(--color-success-medium)] font-semibold mb-2 text-sm sm:text-base">Why Payroll & Benefits Matter</p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight">
                        Timely Pay, Meaningful Benefits,<br />
                        Happier Employees
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-base sm:text-lg">
                        Strong payroll and benefits systems improve trust, retention, compliance, and workforce satisfaction
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="space-y-8">
                            {/* Feature Items */}
                            {[
                                { icon: Shield, title: "Builds Employee Trust and Loyalty" },
                                { icon: Users, title: "Ensures Legal and Tax Compliance" },
                                { icon: Award, title: "Attracts and Retains Top Talent" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex gap-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                                    whileHover={{ x: 10 }}
                                >
                                    <motion.div
                                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-blue)] rounded-full flex items-center justify-center flex-shrink-0"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-text-white)]" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base">
                                            On-time, accurate payroll shows employees they're valued — boosting morale and
                                            reducing turnover. Automated updates reduce risk of penalties from ever-changing
                                            labor and tax regulations.
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <motion.div
                            className="bg-[var(--color-bg-secondary)] rounded-3xl shadow-2xl overflow-hidden w-full max-w-full h-auto"
                            whileHover={scaleHover}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1590650046871-92c887180603"
                                alt="Happy employees collaboration"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
            <AccordionDemo />
        </div>
    );
};

export default PayrollBenefits;
