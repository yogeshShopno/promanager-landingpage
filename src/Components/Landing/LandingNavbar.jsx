import { Button } from "./ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const LandingNavbar = () => {
    const [isPagesOpen, setIsPagesOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <header className="bg-white backdrop-blur-sm  border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <NavLink to="/" onClick={scrollToTop}>
                                <img
                                    src={Logo}
                                    alt="ProManager Logo"
                                    className="h-12 w-auto object-contain max-w-[200px] cursor-pointer"
                                />
                            </NavLink>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/about", label: "About Us" },
                                { to: "/services", label: "Services" },
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={scrollToTop}
                                    className="relative group px-4 py-2"
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={`text-base font-medium transition-colors ${
                                                isActive 
                                                    ? "text-[var(--color-blue)]" 
                                                    : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-blue)]"
                                            }`}>
                                                {item.label}
                                            </span>
                                            {/* Bottom Border Animation */}
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-blue)]"
                                                initial={false}
                                                animate={{
                                                    scaleX: isActive ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            {/* Hover Border */}
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-blue)]"
                                                initial={{ scaleX: 0 }}
                                                whileHover={{ scaleX: isActive ? 0 : 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            ))}

                            {/* Pages Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsPagesOpen(true)}
                                onMouseLeave={() => setIsPagesOpen(false)}
                            >
                                <button className="relative group flex items-center space-x-1 px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-blue)] transition-colors">
                                    <span className="text-base font-medium">Pages</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-200 ${
                                            isPagesOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                    {/* Hover Border */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-blue)]"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: isPagesOpen ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isPagesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[var(--color-blue)] overflow-hidden z-[60]"
                                        >
                                            {[
                                                { to: "/employee-management", label: "Employee Management" },
                                                { to: "/payroll-benefits", label: "Payroll & Benefits" },
                                                { to: "/contact", label: "Book Appointment / Demo" },
                                            ].map((item) => (
                                                <NavLink
                                                    key={item.to}
                                                    to={item.to}
                                                    onClick={scrollToTop}
                                                    className="block"
                                                >
                                                    {({ isActive }) => (
                                                        <div className={`px-4 py-3 transition-colors ${
                                                            isActive
                                                                ? "bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-blue)]"
                                                        }`}>
                                                            {item.label}
                                                        </div>
                                                    )}
                                                </NavLink>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Auth Buttons (Desktop) */}
                        <div className="hidden md:flex items-center space-x-3">
                            <NavLink to="/login">
                                <motion.button
                                    className="px-6 py-2.5 text-[var(--color-blue)] font-medium border-2 border-[var(--color-blue)] rounded-full hover:bg-[var(--color-blue)] hover:text-white transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Log In
                                </motion.button>
                            </NavLink>
                            <NavLink to="/contact">
                                <motion.button
                                    className="px-6 py-2.5 bg-[var(--color-blue)] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Book Appointment
                                </motion.button>
                            </NavLink>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-[9998]"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[9999] flex flex-col overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
                                <span className="text-xl font-semibold text-[var(--color-text-primary)]">Menu</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <X className="h-6 w-6 text-[var(--color-text-secondary)]" />
                                </Button>
                            </div>

                            {/* Menu Items */}
                            <div className="flex flex-col p-6 space-y-2">
                                {[
                                    { to: "/", label: "Home" },
                                    { to: "/about", label: "About Us" },
                                    { to: "/services", label: "Services" },
                                ].map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => {
                                            scrollToTop();
                                            setIsMobileOpen(false);
                                        }}
                                    >
                                        {({ isActive }) => (
                                            <div className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                                                isActive
                                                    ? "bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                                                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-blue)]"
                                            }`}>
                                                {item.label}
                                            </div>
                                        )}
                                    </NavLink>
                                ))}

                                {/* Pages Section */}
                                <div className="pt-4">
                                    <h3 className="px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                                        Pages
                                    </h3>
                                    {[
                                        { to: "/employee-management", label: "Employee Management" },
                                        { to: "/payroll-benefits", label: "Payroll & Benefits" },
                                        { to: "/contact", label: "Book Appointment / Demo" },
                                    ].map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => {
                                                scrollToTop();
                                                setIsMobileOpen(false);
                                            }}
                                        >
                                            {({ isActive }) => (
                                                <div className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                                                    isActive
                                                        ? "bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-blue)]"
                                                }`}>
                                                    {item.label}
                                                </div>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>

                                {/* Auth Buttons */}
                                <div className="pt-6 space-y-3 border-t border-[var(--color-border)]">
                                    <NavLink
                                        to="/login"
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <motion.button
                                            className="w-full px-6 py-3 mb-5 text-[var(--color-blue)] font-medium border-2 border-[var(--color-blue)] rounded-full hover:bg-[var(--color-blue)] hover:text-white transition-all"
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Log In
                                        </motion.button>
                                    </NavLink>
                                    <NavLink
                                        to="/contact"
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <motion.button
                                            className="w-full px-6 py-3 bg-[var(--color-blue)] text-white font-medium rounded-full shadow-lg"
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Book Appointment
                                        </motion.button>
                                    </NavLink>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
