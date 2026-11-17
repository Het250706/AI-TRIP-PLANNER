import React from "react";
import { Link } from "react-router-dom";
import { Globe, Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="logo" className="h-10" />
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">TRIP AI</span>
                        </div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Revolutionizing travel planning with next-gen AI. Turn your dreams into perfectly curated itineraries in seconds.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-widest text-xs text-gray-900 mb-8 italic">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Career', 'Press', 'Journal'].map(item => (
                                <li key={item}><Link to="#" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-widest text-xs text-gray-900 mb-8 italic">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Safety', 'Cancellation', 'COVID-19'].map(item => (
                                <li key={item}><Link to="#" className="text-gray-500 hover:text-blue-600 font-bold transition-colors">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                        <h4 className="font-black text-blue-900 mb-4 uppercase tracking-tighter text-lg italic">Join the Journey</h4>
                        <p className="text-blue-700/70 text-sm font-medium mb-6">Get the latest travel deals and AI features delivered to your inbox.</p>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="Email address"
                                className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-blue-600/20 font-bold text-gray-900 placeholder:text-gray-400 shadow-sm"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-90 transition-all">
                                <Globe size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
                        © 2026 TRIP AI. BY HET PATEL.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link to="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Privacy</Link>
                        <Link to="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Terms</Link>
                        <Link to="#" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
