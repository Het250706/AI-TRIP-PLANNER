import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Map, Shield, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-36 pb-20">
      {/* Dynamic Background Image */}
      <motion.img
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
        alt="Travel"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Animated Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-widest uppercase mb-8">
            Next-Gen AI Travel Assistant
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter">
            EXPLORE THE <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              UNEXPECTED
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Revolutionize your journey with AI-driven itineraries, real-time insights,
            and seamless booking. Your perfect trip is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, shadow: "0 0 40px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-blue-600/40 flex items-center gap-3"
              >
                Plan My Trip <Plane className="rotate-45" />
              </motion.button>
            </Link>
            <Link to="/explore">
              <motion.button
                whileHover={{ scale: 1.05, bg: "rgba(255, 255, 255, 0.15)" }}
                className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-bold text-xl border border-white/20"
              >
                Explore Destinations
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
          {[
            { icon: <Map className="text-blue-400" />, label: "Smart Maps" },
            { icon: <Shield className="text-green-400" />, label: "Secure Travel" },
            { icon: <Calendar className="text-purple-400" />, label: "AI Planning" },
            { icon: <Plane className="text-orange-400" />, label: "Easy Booking" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10 flex flex-col items-center gap-3"
            >
              {item.icon}
              <span className="text-white text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
      >
        <div className="w-1 h-2 bg-blue-400 rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default Hero;
