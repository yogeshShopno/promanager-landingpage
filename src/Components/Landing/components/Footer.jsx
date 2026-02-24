import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Instagram, Linkedin, X } from 'lucide-react';

const Footer = () => {
    const MotionLink = motion(Link);
    
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
        <footer className="bg-gradient-to-br from-[#6C4CF1] via-[#5b3dd9] to-[#4B2EDB] text-white">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative py-20 px-6 overflow-hidden"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src="https://img.freepik.com/free-photo/medium-shot-woman-working-laptop_23-2149300654.jpg"
                            alt="Payroll Professional"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    </div>

                    {/* Content Over Image */}
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight"
                        >
                            Streamline Your Payroll,{" "}
                            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                Empower Your Business
                            </span>
                        </motion.h2>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-white/90 text-xl mb-10 leading-relaxed max-w-3xl mx-auto"
                        >
                            Join thousands of businesses automating payroll processing, ensuring compliance, and saving time with ProManager's powerful platform.
                        </motion.p>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-[#6C4CF1] font-bold rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300"
                            >
                                Get Started Now
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
                            >
                                Learn More
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Navigation Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="px-6 py-12 border-t border-white/10"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {navigationColumns.map((column, columnIndex) => (
                                <motion.div
                                    key={column.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: columnIndex * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="text-lg font-bold mb-4">{column.title}</h3>
                                    <ul className="space-y-3">
                                        {column.links.map((link, linkIndex) => (
                                            <motion.li
                                                key={linkIndex}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: (columnIndex * 0.1) + (linkIndex * 0.05) + 0.2 }}
                                                viewport={{ once: true }}
                                            >
                                                <MotionLink
                                                    to={link.comingSoon ? "/coming-soon" : link.href}
                                                    state={link.comingSoon ? { pageName: link.name } : undefined}
                                                    className="text-sm text-white/80 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-2"
                                                    whileHover={{ x: 5 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {link.name}
                                                    {link.comingSoon && (
                                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                                            Soon
                                                        </span>
                                                    )}
                                                </MotionLink>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}

                            {/* Connect Column */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-lg font-bold mb-4">Connect</h3>
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
                                                transition={{ duration: 0.4, delay: 0.5 + (index * 0.1), type: "spring", stiffness: 200 }}
                                                viewport={{ once: true }}
                                                whileHover={{ scale: 1.2, rotate: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all"
                                            >
                                                <IconComponent size={20} />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    viewport={{ once: true }}
                                    className="mt-6 text-sm text-white/80"
                                >
                                    <p className="mb-2">Email us:</p>
                                    <a href="mailto:support@promanager.in" className="text-white hover:underline">
                                        support@promanager.in
                                    </a>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Large Branding */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="px-6 py-16 text-center border-t border-white/10"
                >
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white">
                        ProManager
                    </h2>
                </motion.div>

                {/* Bottom Copyright */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-black/20 backdrop-blur-sm border-t border-white/10 px-6 py-6"
                >
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mb-2 md:mb-0 text-white/80"
                        >
                            © 2025 ProManager — Ultimate Payroll Software. All rights reserved.
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
                                className="text-white/80 hover:text-white transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                Security Policy
                            </MotionLink>
                            <MotionLink
                                to="/terms-of-service"
                                className="text-white/80 hover:text-white transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                Terms Of Service
                            </MotionLink>
                            <MotionLink
                                to="/privacy-policy"
                                className="text-white/80 hover:text-white transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                Privacy Policy
                            </MotionLink>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
