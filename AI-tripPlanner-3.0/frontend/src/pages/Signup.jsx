import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Lock, User, ShieldCheck, ArrowRight, ArrowLeft, 
    CheckCircle2, Eye, EyeOff, Sparkles, Star, MapPin, KeyRound 
} from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/send-otp', { email });
            setMessage('Verification code has been sent to your email.');
            setOtpSent(true);
            if (response.data.otp) {
                setOtp(response.data.otp);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            await api.post('/api/auth/register', { fullname, email, password, otp });
            setMessage('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            {/* Left Visual Panel (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 select-none">
                <img
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600"
                    alt="Tropical Bali"
                    className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-10000 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/60"></div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full text-white">
                    {/* Top Brand Tag */}
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src="/logo.png" alt="Trip Planner" className="h-9 w-auto" />
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent italic tracking-tight">
                                TRIP AI
                            </span>
                        </Link>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
                            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                            <span>Free Account</span>
                        </div>
                    </div>

                    {/* Middle Highlights */}
                    <div className="space-y-6 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                            <MapPin size={13} />
                            Bali, Indonesia
                        </div>
                        <h2 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
                            Start your travel story <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                                with AI precision.
                            </span>
                        </h2>
                        <p className="text-slate-300 text-base leading-relaxed font-normal">
                            Join thousands of explorers building personalized vacations, saving budget, and uncovering hidden spots with automated travel AI.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Zero-cost sign up</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Unlimited trip planning</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Interactive map views</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Traveler community</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Review Pill */}
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?u=4" alt="traveler" />
                                <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?u=5" alt="traveler" />
                                <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?u=6" alt="traveler" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">Rated 4.9 by Explorers</p>
                                <p className="text-[11px] text-slate-300">Over 25,000 itineraries generated</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                            <Star size={13} fill="currentColor" />
                            <span>100% Free</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-16 min-h-screen overflow-y-auto">
                {/* Top Nav / Home link */}
                <div className="flex items-center justify-between w-full max-w-md mx-auto">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className="lg:hidden flex items-center gap-2">
                        <img src="/logo.png" alt="Trip Planner" className="h-7 w-auto" />
                        <span className="font-black text-blue-600 tracking-tight">TRIP AI</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="w-full max-w-md mx-auto my-auto py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest block">
                                Get Started
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-500">
                                {otpSent ? 'Step 2 of 2' : 'Step 1 of 2'}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">
                            {otpSent 
                                ? 'Enter your verification code and profile details to complete setup.' 
                                : 'Join 10,000+ travelers revolutionizing their trips with AI.'}
                        </p>
                    </div>

                    {/* Success Alert */}
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3 shadow-sm"
                        >
                            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                            <span>{message}</span>
                        </motion.div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 text-rose-700 border border-rose-200/80 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3 shadow-sm"
                        >
                            <ShieldCheck size={18} className="text-rose-600 shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={otpSent ? handleSignup : handleSendOtp} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail 
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" 
                                    size={18} 
                                />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none transition-all shadow-sm ${
                                        otpSent ? 'bg-slate-100/70 text-slate-500 cursor-not-allowed' : ''
                                    }`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={otpSent}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Step 2 Fields */}
                        <AnimatePresence>
                            {otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden pt-1"
                                >
                                    {/* Verification Code */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            Verification Code (OTP)
                                        </label>
                                        <div className="relative group">
                                            <KeyRound 
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" 
                                                size={18} 
                                            />
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-900 text-sm font-semibold tracking-wider placeholder:tracking-normal placeholder:text-slate-400 outline-none transition-all shadow-sm"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <User 
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" 
                                                size={18} 
                                            />
                                            <input
                                                type="text"
                                                placeholder="e.g. Alex Morgan"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none transition-all shadow-sm"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                                required
                                                autoComplete="name"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                            Create Password
                                        </label>
                                        <div className="relative group">
                                            <Lock 
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" 
                                                size={18} 
                                            />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="At least 6 characters"
                                                className="w-full pl-11 pr-12 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none transition-all shadow-sm"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                                                tabIndex={-1}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 group transition-all duration-200 hover:shadow-xl active:scale-[0.99] disabled:opacity-60 cursor-pointer ${
                                otpSent 
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/25' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/25'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>{otpSent ? 'Complete Adventure' : 'Send Verification Code'}</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-200">
                        <p className="text-slate-600 text-sm">
                            Already an explorer?{' '}
                            <Link 
                                to="/login" 
                                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Sign in to your profile
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 pt-4">
                    <span>© 2026 TRIP AI. By registering, you agree to our Terms & Privacy Policy.</span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
