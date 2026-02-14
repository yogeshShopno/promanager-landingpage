import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smartphone, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { setPermissions } from "../redux/permissionsSlice";
import Logo from "../assets/logo.png";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_AES_SECRET_KEY;
const COOKIE_EXPIRY_DAYS = 7;

// AES helpers
const encrypt = (val) => CryptoJS.AES.encrypt(val, SECRET_KEY).toString();
const decrypt = (val) => {
    try {
        return CryptoJS.AES.decrypt(val, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    } catch {
        return "";
    }
};

const Login = () => {
    const { login, isAuthenticated } = useAuth();

    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(
        Cookies.get("rememberMe") === "1"
    );
    const [isLoading, setIsLoading] = useState(false);

    // field-specific errors
    const [numberError, setNumberError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const flattenPermissions = (permissionsArray) =>
        permissionsArray.reduce((acc, item) => ({ ...acc, ...item }), {});

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const savedNumber = Cookies.get("savedNumber");
        const savedPassword = Cookies.get("savedPassword");

        if (savedNumber) setNumber(decrypt(savedNumber));
        if (savedPassword) setPassword(decrypt(savedPassword));
    }, []);

    const validateInputs = () => {
        let valid = true;
        setNumberError("");
        setPasswordError("");

        if (!number) {
            setNumberError("Please enter your mobile number.");
            valid = false;
        } else if (!/^\d{10}$/.test(number)) {
            setNumberError("Mobile number must be 10 digits.");
            valid = false;
        }

        if (!password) {
            setPasswordError("Please enter your password.");
            valid = false;
        } else {
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                setPasswordError(
                    "Password must be 8+ chars, include upper, lower, number & special char."
                );
                valid = false;
            }
        }

        return valid;
    };

    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) setNumber(value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append("number", number);
        formData.append("password", password);

        try {
            const res = await api.post("login", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { success, user_data, message } = res.data;
            if (success && user_data) {
                const userData = {
                    user_id: user_data.user_id,
                    full_name: user_data.full_name,
                    username: user_data.username,
                    email: user_data.email || "",
                    number: user_data.number,
                    type: user_data.type,
                    user_roles_id: user_data.user_role_id,
                    subscriptions_status: user_data.subscriptions_status,
                    subscriptions_days: user_data.subscriptions_days,
                };
                login(userData, rememberMe);

                // Permissions
                const permFormData = new FormData();
                permFormData.append("user_id", user_data.user_id);
                permFormData.append("user_roles_id", user_data.user_role_id);
                const permRes = await api.post("user_permissions", permFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (permRes.data?.data) {
                    const flatPermissions = flattenPermissions(permRes.data.data);
                    dispatch(setPermissions(flatPermissions));
                }

                // ✅ Remember Me handling with encryption
                if (rememberMe) {
                    Cookies.set("rememberMe", "1", { expires: COOKIE_EXPIRY_DAYS });
                    Cookies.set("savedNumber", encrypt(number), {
                        expires: COOKIE_EXPIRY_DAYS,
                    });
                    Cookies.set("savedPassword", encrypt(password), {
                        expires: COOKIE_EXPIRY_DAYS,
                    });
                } else {
                    Cookies.remove("rememberMe");
                    Cookies.remove("savedNumber");
                    Cookies.remove("savedPassword");
                }

                navigate("/dashboard");
            } else {
                setPasswordError(message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setPasswordError("Invalid credentials. Please try again.");
            } else if (error.response?.status >= 500) {
                setPasswordError("Server error. Please try again later.");
            } else {
                setPasswordError("Login failed. Please check your internet connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen w-full flex bg-[var(--color-bg-primary)] overflow-hidden">
            {/* Left panel unchanged */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex w-1/2 bg-[var(--color-blue)] items-center justify-center p-12 relative overflow-hidden"
            >
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackClick}
                    className="absolute top-8 left-8 flex items-center gap-2 text-[var(--color-text-white-90)] hover:text-[var(--color-text-white)] transition-colors duration-200 z-20"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </motion.button>

                <div className="text-center text-[var(--color-text-white)] z-10 max-w-lg">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Effortlessly manage your team and operations.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xl mb-8 text-[var(--color-blue-lightest)]"
                    >
                        Log in to access your CRM dashboard and manage your team.
                    </motion.p>

                    {/* Dashboard Preview Image */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Dashboard Preview"
                            className="w-full max-w-md mx-auto rounded-xl shadow-2xl border-4 border-white/20"
                        />
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="absolute -top-4 -right-4 bg-[var(--color-bg-secondary)] rounded-lg p-3 shadow-lg"
                        >
                            <div className="text-sm font-semibold text-[var(--color-text-primary)]">6,248 Units</div>
                            <div className="text-xs text-[var(--color-text-muted)]">Sales Categories</div>
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="absolute -bottom-4 -left-4 bg-[var(--color-bg-secondary)] rounded-lg p-3 shadow-lg"
                        >
                            <div className="text-sm font-semibold text-[var(--color-text-primary)]">$189,374</div>
                            <div className="text-xs text-[var(--color-text-muted)]">Total Sales</div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-20 left-20 w-32 h-32 bg-[var(--color-text-white)] rounded-full"
                    ></motion.div>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 2.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute bottom-32 right-16 w-24 h-24 bg-[var(--color-text-white)] rounded-full"
                    ></motion.div>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.1 }}
                        transition={{ duration: 1.8, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-1/2 left-8 w-16 h-16 bg-[var(--color-text-white)] rounded-full"
                    ></motion.div>
                </div>
            </motion.div>
            {/* Right Side - Login Form */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
            >
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-12">
                        <img src={Logo} alt="promanager Logo" className="w-40 h-20 object-contain" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Mobile Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <input
                                    type="text"
                                    value={number}
                                    onChange={handleNumberChange}
                                    maxLength={10}
                                    placeholder="Enter your mobile number"
                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg ${numberError ? "border-red-500" : ""
                                        }`}
                                    disabled={isLoading}
                                />
                            </div>
                            {numberError && (
                                <p className="mt-1 text-sm text-red-500">{numberError}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full pl-11 pr-10 py-3 border rounded-lg ${passwordError ? "border-red-500" : ""
                                        }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="ml-2 text-sm">Remember Me</span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-blue)] text-white py-3 rounded-lg mt-6"
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
