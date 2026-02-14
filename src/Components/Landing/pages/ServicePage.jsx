import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
    Clock,
    BarChart,
    User,
    DollarSign,
    Cloud,
    Headphones,
    Layers,
    Puzzle
} from 'lucide-react';
import ServicesSection from '../components/ServicesSection';
import { Helmet } from "@dr.pogodin/react-helmet";


// Utility function for combining class names
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const ref = useRef();
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration });
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = prefix + Math.floor(latest) + suffix;
            }
        });
    }, [springValue, prefix, suffix]);

    return <span ref={ref}>{prefix}0{suffix}</span>;
};

const HRServicesPlatform = () => {
    const features = [
        {
            title: "Seamless Payroll",
            description:
                "Automate salary calculations, deductions, and compliance with ease.",
            icon: <DollarSign className="w-6 h-6" />,
        },
        {
            title: "Smart Attendance",
            description:
                "Track employee attendance and leave with accuracy and real-time updates.",
            icon: <Clock className="w-6 h-6" />,
        },
        {
            title: "Scalable & Secure",
            description:
                "A cloud-based solution designed to grow with your business while keeping data safe.",
            icon: <Cloud className="w-6 h-6" />,
        },
        {
            title: "Employee Self-Service",
            description:
                "Give employees easy access to payslips, leave balances, and requests.",
            icon: <User className="w-6 h-6" />,
        },
        {
            title: "Performance Insights",
            description:
                "Get actionable analytics to measure workforce efficiency and productivity.",
            icon: <BarChart className="w-6 h-6" />,
        },
        {
            title: "Multi-Company Support",
            description:
                "Manage payroll and HR across multiple entities from one platform.",
            icon: <Layers className="w-6 h-6" />,
        },
        {
            title: "24/7 Support",
            description:
                "Our team is here to help you anytime, ensuring smooth operations.",
            icon: <Headphones className="w-6 h-6" />,
        },
        {
            title: "Flexible Integrations",
            description:
                "Easily connect with your existing tools and workflows for a unified system.",
            icon: <Puzzle className="w-6 h-6" />,
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] py-16">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.p
                    className="text-[var(--color-text-secondary)] text-sm font-medium mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Our Service
                </motion.p>
                <motion.h1
                    className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Future-Ready HR<br />
                    Services Platform
                </motion.h1>
                <motion.p
                    className="text-[var(--color-text-secondary)] max-w-2xl mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Empower your workforce with agile, scalable, and intelligent HR solutions
                    built for tomorrow's challenges
                </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </div>
    );
};

const Feature = ({ title, description, icon, index }) => {
    return (
        <motion.div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature",
                (index === 0 || index === 4) && "lg:border-l",
                index < 4 && "lg:border-b"
            )}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            whileHover={{
                y: -5,
                transition: { duration: 0.2 }
            }}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-[var(--color-bg-secondary-30)] to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-[var(--color-bg-secondary-30)] to-transparent pointer-events-none" />
            )}

            <motion.div
                className="mb-4 relative z-10 px-10 text-[var(--color-text-secondary)]"
                whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 }
                }}
            >
                {icon}
            </motion.div>

            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[var(--color-border-secondary)] group-hover/feature:bg-[var(--color-blue)] transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-[var(--color-text-primary)]">
                    {title}
                </span>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] max-w-xs relative z-10 px-10">
                {description}
            </p>
        </motion.div>
    );
};

const ServicePage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                duration: 0.8
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const boxVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] pt-16">
            <Helmet>
                <title>Payroll & HR Services | promanager Official Platform</title>
                <meta
                    name="description"
                    content="Discover promanager payroll and HR services. Automate salary, compliance, attendance, employee management, and insights with our secure SaaS platform."
                />
                <link rel="canonical" href="https://promanager.in/services" />
                <meta
                    name="keywords"
                    content="promanager Services, Payroll Automation, HR Platform, Attendance Management, SaaS Payroll, Employee Self Service"
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="promanager" />
                <meta property="og:title" content="Payroll & HR Services | promanager Platform" />
                <meta
                    property="og:description"
                    content="Streamline payroll, HR, and workforce management with promanager's SaaS platform. Trusted by modern businesses for compliance and automation."
                />
                <meta property="og:url" content="https://promanager.in/services" />
                <meta property="og:image" content="https://promanager.in/logo.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@promanager" />
                <meta name="twitter:title" content="Payroll & HR Services | promanager" />
                <meta
                    name="twitter:description"
                    content="Explore promanager's payroll and HR services. Automate salaries, compliance, and employee management with ease."
                />
                <meta name="twitter:image" content="https://promanager.in/logo.png" />
            </Helmet>
            {/* Header Section */}
            <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="inline-block bg-[var(--color-blue-lightest)] text-[var(--color-text-blue)] px-3 py-1 rounded-full text-sm font-medium mb-4"
                    variants={itemVariants}
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 }
                    }}
                >
                    Smarter Payroll & HR
                </motion.div>

                <motion.h1
                    className="text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight"
                    variants={itemVariants}
                >
                    Streamline Payroll & Workforce Management <br />
                    with <span className="text-[var(--color-text-blue)]">promanager</span>
                </motion.h1>

                <motion.p
                    className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-8"
                    variants={itemVariants}
                >
                    Manage everything from <strong>attendance and leave tracking</strong> to
                    <strong> payroll, compliance, and employee insights</strong> — all in one
                    secure, scalable, and intuitive platform designed for modern teams and growing businesses.
                </motion.p>

                <motion.div
                    className="flex gap-4 justify-center"
                    variants={itemVariants}
                >
                    <motion.button
                        className="bg-[var(--color-blue-dark)] text-[var(--color-text-white)] px-8 py-3 rounded-full hover:bg-[var(--color-blue-darker)] transition-colors"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started
                    </motion.button>
                    <motion.button
                        className="text-[var(--color-text-secondary)] px-8 py-3 border border-[var(--color-border-secondary)] rounded-full hover:bg-[var(--color-bg-secondary-20)] transition-colors"
                        whileHover={{
                            scale: 1.05,
                            borderColor: "var(--color-blue)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Features
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Content Boxes */}
            <motion.div
                className="flex gap-6 justify-center mb-16"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                    duration: 1,
                    ease: "easeOut",
                    staggerChildren: 0.2
                }}
            >
                {/* First Box - 304x508 */}
                <motion.div
                    className="bg-[var(--color-bg-card)] rounded-2xl shadow-lg overflow-hidden"
                    style={{ width: '304px', height: '508px' }}
                    variants={boxVariants}
                    whileHover={{
                        scale: 1.02,
                        y: -10,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        transition: { duration: 0.3 }
                    }}
                >
                    <motion.img
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Team collaboration"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.div>

                {/* Second Box - 508x508 */}
                <motion.div
                    className="bg-[var(--color-bg-card)] rounded-2xl shadow-lg overflow-hidden"
                    style={{ width: '508px', height: '508px' }}
                    variants={boxVariants}
                    whileHover={{
                        scale: 1.02,
                        y: -10,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        transition: { duration: 0.3 }
                    }}
                >
                    <motion.img
                        src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Team meeting"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.div>

                {/* Third Column - Two stacked boxes */}
                <div className="flex flex-col gap-6">
                    {/* Upper Box - 508x242 */}
                    <motion.div
                        className="bg-[var(--color-bg-card)] rounded-2xl shadow-lg overflow-hidden"
                        style={{ width: '508px', height: '242px' }}
                        variants={boxVariants}
                        whileHover={{
                            scale: 1.02,
                            y: -10,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            transition: { duration: 0.3 }
                        }}
                    >
                        <motion.img
                            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Business consultation"
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.div>

                    {/* Lower Box - 508x242 - Client testimonial */}
                    <motion.div
                        className="bg-[var(--color-blue-darker)] rounded-2xl shadow-lg overflow-hidden p-8 text-[var(--color-text-white)] flex flex-col justify-between"
                        style={{ width: '508px', height: '242px' }}
                        variants={boxVariants}
                        whileHover={{
                            scale: 1.02,
                            y: -10,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div>
                            <motion.h3
                                className="text-2xl font-bold mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                Trusted by Businesses
                            </motion.h3>
                            <motion.p
                                className="text-[var(--color-text-white)] mb-6"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                Companies across industries rely on <strong>promanager</strong> to simplify payroll,
                                boost efficiency, and improve employee satisfaction.
                            </motion.p>
                        </div>
                        <motion.div
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <div className="flex items-center gap-4">
                                {['Acme Corp', 'Globex', 'Initech'].map((company, index) => (
                                    <motion.div
                                        key={company}
                                        className="bg-[var(--color-blue-dark)] rounded-lg px-4 py-2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <span className="text-sm font-medium">{company}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-12 h-12 bg-[var(--color-blue-dark)] rounded-full flex items-center justify-center"
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.8,
                                        type: "spring",
                                        stiffness: 200
                                    }}
                                >
                                    <span className="text-xs font-bold">
                                        <AnimatedCounter value={80} suffix="+" />
                                    </span>
                                </motion.div>
                                <motion.span
                                    className="text-sm font-medium text-[var(--color-text-white)]"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.9 }}
                                >
                                    Clients
                                </motion.span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            <HRServicesPlatform />
            <ServicesSection />
        </div>
    );
};

export default ServicePage;