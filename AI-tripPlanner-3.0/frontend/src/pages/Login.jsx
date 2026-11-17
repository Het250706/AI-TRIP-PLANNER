import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
    Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, 
    Eye, EyeOff, Sparkles, Star, MapPin, CheckCircle2 
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/login', { email, password });
            if (response.data.token && response.data.user) {
                login(response.data.token, response.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            {/* Left Visual Panel (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 select-none">
                <img
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1600"
                    alt="Travel destination"
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
                            <span>AI Trip Planner 3.0</span>
                        </div>
                    </div>

                    {/* Middle Highlights */}
                    <div className="space-y-6 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                            <MapPin size={13} />
                            Amalfi Coast, Italy
                        </div>
                        <h2 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight">
                            The world is yours to explore. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                                We handle the planning.
                            </span>
                        </h2>
                        <p className="text-slate-300 text-base leading-relaxed font-normal">
                            Generate curated day-by-day itineraries, discover handpicked accommodations, and uncover hidden gems tailored to your travel style.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Instant AI Itineraries</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Real-Time Weather</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Budget Optimization</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-200 text-sm font-medium">
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span>Flight & Hotel Search</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Review Pill */}
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?u=1" alt="traveler" />
                                <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?u=2" alt="traveler" />
                                <img className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover" src="https://i.pravatar.cc/100?u=3" alt="traveler" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">10,000+ Explorers</p>
                                <p className="text-[11px] text-slate-300">Curating trips across 120+ countries</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                            <Star size={13} fill="currentColor" />
                            <span>4.9 / 5</span>
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
                        <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest block mb-2">Welcome Back</span>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Sign in to your account
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">
                            Access your saved itineraries, bookmarks, and AI travel plans.
                        </p>
                    </div>

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

                    <form onSubmit={handleLogin} className="space-y-5">
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
                                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none transition-all shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link 
                                    to="#" 
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock 
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" 
                                    size={18} 
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-12 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-900 text-sm font-medium placeholder:text-slate-400 outline-none transition-all shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Switch to Signup */}
                    <div className="mt-8 text-center pt-6 border-t border-slate-200">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Create an account for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="w-full max-w-md mx-auto text-center text-xs text-slate-400 pt-4">
                    <span>© 2026 TRIP AI. All rights reserved. Secure SSL encryption.</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
