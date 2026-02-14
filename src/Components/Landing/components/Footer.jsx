import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Instagram, Linkedin, X } from 'lucide-react';

const Footer = () => {
    const MotionLink = motion(Link);
    // Simplified navigation with only available/anchor links for promanager
    const navigationColumns = [
        {
            title: "Product",
            links: [
                { name: "Features", href: "/employee-management" },
                { name: "Pricing", href: "/pricing", comingSoon: true },
                { name: "Demo", href: "/demo", comingSoon: true },
                { name: "FAQ", href: "/contact" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Careers", href: "/", comingSoon: true },
                { name: "Blog", href: "/", comingSoon: true }
            ]
        },
        {
            title: "Payroll Solutions",
            links: [
                { name: "Employee Management", href: "/employee-management" },
                { name: "Payroll & Benefits", href: "/payroll-benefits" },
                { name: "Reports", href: "/reports", comingSoon: true },
                { name: "Integration", href: "/integration", comingSoon: true }
            ]
        }
    ];

    const socialIcons = [
        { icon: MessageCircle, href: "#", label: "Chat" },
        { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: X, href: "https://twitter.com", label: "Twitter" }
    ];

    return (
        <>
            <footer className="bg-[var(--color-blue-darker)] min-h-screen flex flex-col justify-between">
                <div className="container mx-auto px-4">
                    {/* Hero Section with Animation */}
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="rounded-2xl m-6 p-10 flex flex-col md:flex-row items-center"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-blue-lightest) 0%, var(--color-blue-lighter) 100%)'
                        }}
                    >
                        {/* Left Text with Animation */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight"
                            >
                                Streamline Your Payroll, Empower Your Business
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                                className="text-[var(--color-text-secondary)] mb-6 leading-relaxed"
                            >
                                Join thousands of businesses automating payroll processing, ensuring compliance, and saving time with promanager's powerful payroll management platform
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-[var(--color-blue-darker)] text-[var(--color-text-white)] px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-blue-darkest)] transition-colors"
                                >
                                    Get Started Now
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-2 border-[var(--color-blue-darker)] text-[var(--color-blue-darker)] px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-blue-darker)] hover:text-[var(--color-text-white)] transition-colors"
                                >
                                    Learn More
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Right Image with Animation */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotateY: -15 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="flex-1 mt-8 md:mt-0 md:ml-8 flex justify-center items-center"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.02,
                                    rotateY: 5,
                                    transition: { duration: 0.4 }
                                }}
                                className="w-full max-w-md h-[300px] md:h-[350px]"
                            >
                                <img
                                    src="https://img.freepik.com/free-photo/medium-shot-woman-working-laptop_23-2149300654.jpg"
                                    alt="Payroll Professional"
                                    className="w-full h-full object-cover rounded-xl shadow-lg"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.section>

                    {/* Navigation Links Section with Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-text-white)] px-6 py-12"
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {/* Navigation Columns with Staggered Animation */}
                                {navigationColumns.map((column, columnIndex) => (
                                    <motion.div
                                        key={column.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: columnIndex * 0.1
                                        }}
                                        viewport={{ once: true }}
                                    >
                                        <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
                                        <ul className="space-y-3">
                                            {column.links.map((link, linkIndex) => (
                                                <motion.li
                                                    key={linkIndex}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: (columnIndex * 0.1) + (linkIndex * 0.05) + 0.2
                                                    }}
                                                    viewport={{ once: true }}
                                                >
                                                    <MotionLink
                                                        to={link.comingSoon ? "/coming-soon" : link.href}
                                                        state={link.comingSoon ? { pageName: link.name } : undefined}
                                                        className={`text-sm transition-colors cursor-pointer inline-flex items-center gap-2 ${link.comingSoon
                                                            ? 'text-[var(--color-text-white-90)] hover:text-[var(--color-blue-lighter)]'
                                                            : 'hover:text-[var(--color-blue-lighter)]'
                                                            }`}
                                                        whileHover={{ x: 5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {link.name}
                                                        {link.comingSoon && (
                                                            <span className="text-xs bg-[var(--color-bg-secondary-20)] px-2 py-0.5 rounded-full">
                                                                Soon
                                                            </span>
                                                        )}
                                                    </MotionLink>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}

                                {/* Contact Us Column with Social Icons Animation */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="text-lg font-semibold mb-4">Connect</h3>
                                    <div className="flex space-x-3">
                                        {socialIcons.map((social, index) => {
                                            const IconComponent = social.icon;
                                            return (
                                                <motion.a
                                                    key={index}
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={social.label}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: 0.5 + (index * 0.1),
                                                        type: "spring",
                                                        stiffness: 200
                                                    }}
                                                    viewport={{ once: true }}
                                                    whileHover={{
                                                        scale: 1.2,
                                                        rotate: 10,
                                                        transition: { duration: 0.3 }
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="bg-[var(--color-bg-secondary-20)] p-2 rounded-full hover:bg-[var(--color-bg-secondary-30)] transition-all"
                                                >
                                                    <IconComponent size={20} className="text-[var(--color-text-white)]" />
                                                </motion.a>
                                            );
                                        })}
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        viewport={{ once: true }}
                                        className="mt-6 text-sm text-[var(--color-text-white-90)]"
                                    >
                                        <p className="mb-2">Email us:</p>
                                        <a
                                            href="mailto:support@promanager.com"
                                            className="text-[var(--color-blue-lighter)] hover:underline"
                                        >
                                            support@promanager.com
                                        </a>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Large promanager Branding Section with Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="px-6 py-16 text-center"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight"
                            style={{
                                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            promanager
                        </motion.h2>
                    </motion.div>

                    {/* Bottom Copyright Bar with Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-[var(--color-blue-darkest)] border-t border-[var(--color-blue-darker)] px-6 py-4"
                    >
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="mb-2 md:mb-0 text-[var(--color-text-white-90)]"
                            >
                                © 2025 promanager — Ultimate Payroll Software. All rights reserved.
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="flex space-x-6"
                            >
                                <MotionLink
                                    to="/security-policy"
                                    className="text-[var(--color-text-white-90)] hover:text-[var(--color-blue-lighter)] transition-colors"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Security Policy
                                </MotionLink>

                                <MotionLink
                                    to="/terms-of-service"
                                    className="text-[var(--color-text-white-90)] hover:text-[var(--color-blue-lighter)] transition-colors"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Terms Of Service
                                </MotionLink>

                                <MotionLink
                                    to="/privacy-policy"
                                    className="text-[var(--color-text-white-90)] hover:text-[var(--color-blue-lighter)] transition-colors"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Privacy Policy
                                </MotionLink>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </footer>

        </>
    );
};

export default Footer;