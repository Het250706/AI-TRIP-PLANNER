import React from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Plane, Star, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const destinations = [
        { name: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800" },
        { name: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800" },
        { name: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" },
        { name: "New York", country: "USA", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800" },
        { name: "Santorini", country: "Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800" },
        { name: "Dubai", country: "UAE", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" }
    ];

    const testimonials = [
        {
            id: 1,
            name: "Tisha Patel",
            avatar: "https://i.pravatar.cc/150?u=1",
            text: "Trip Planner AI saved me hours of research. I just typed 'Japan 10 days' and got a perfect itinerary with hotels and hidden gems in seconds!"
        },
        {
            id: 2,
            name: "Het Patel",
            avatar: "https://i.pravatar.cc/150?u=2",
            text: "Trip Planner AI saved me hours of research. I just typed 'Japan 10 days' and got a perfect itinerary with hotels and hidden gems in seconds!"
        },
        {
            id: 3,
            name: "Preyani Patel",
            avatar: "https://i.pravatar.cc/150?u=3",
            text: "Trip Planner AI saved me hours of research. I just typed 'Japan 10 days' and got a perfect itinerary with hotels and hidden gems in seconds!"
        }
    ];

    return (
        <div className='bg-white overflow-hidden'>
            <Hero />

            {/* Popular Destinations */}
            <section className="max-w-7xl mx-auto px-8 py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <span className="text-blue-600 font-black tracking-widest uppercase text-sm mb-4 block">Crowd Favorites</span>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">
                            Top Destinations <br /> For Your Next Holiday
                        </h2>
                    </div>
                    <p className="text-xl text-gray-500 font-medium max-w-sm mb-2">
                        Discover where fellow travelers are heading this season.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {destinations.map((dest, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -15 }}
                            onClick={() => navigate(`/location/${dest.name}`)}
                            className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl"
                        >
                            <img
                                src={dest.img}
                                alt={dest.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-10 left-10 text-white">
                                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest mb-2">
                                    <MapPin size={14} fill="currentColor" /> Trending Now
                                </div>
                                <h3 className="text-4xl font-black mb-2 italic uppercase tracking-tighter">{dest.name}</h3>
                                <p className="text-xl text-white/70 font-bold uppercase tracking-widest text-xs">{dest.country}</p>
                            </div>
                            <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-xl p-4 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                                <ArrowRight className="text-white" size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gray-50 py-32 rounded-[5rem] mx-8 mb-32 border border-gray-100">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter leading-none">
                            Don't Take <span className="text-blue-600">Our Word</span> For It
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                            Join over 10,000+ travelers who have revolutionized their journey with AI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((item) => (
                            <div key={item.id} className="card-premium h-full hover:scale-105 transition-transform border-2 border-white">
                                <div className="flex items-center mb-8 gap-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-xl">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-lg">{item.name}</h4>
                                        <div className="flex text-yellow-500 gap-1">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium italic">
                                    "{item.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Placeholder (since I don't see Footer.jsx yet) */}
            <Footer />
        </div>
    );
};

export default Home;
