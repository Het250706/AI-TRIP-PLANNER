import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info, Utensils, Hotel, MapPin, ShoppingBag, Calendar,
    Map as MapIcon, Star, Cloud, Wind, Droplets, Plane,
    ChevronRight, ArrowLeft, Camera, Navigation, Coffee,
    Ticket, Bus, Train, Wallet, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { fetchLocationImages } from '../services/imageService';
import { useTranslation } from 'react-i18next';

const LocationDetail = () => {
    const { locationName } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [details, setDetails] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [images, setImages] = useState([]);
    const [bookingType, setBookingType] = useState('flight');

    const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'AIzaSyA8hNRycxPse1KJNuHbakL5NF0iZrixD3g'; // Fallback or user provided

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch dynamic images from Unsplash
                const imgs = await fetchLocationImages(locationName, 5);
                setImages(imgs);

                // Fetch details from backend
                const response = await api.get(`/api/trip/location-details/${locationName}`);
                setDetails(response.data.data);

                // Fetch weather
                try {
                    const weatherRes = await axios.get(
                        `https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&units=metric&appid=${WEATHER_API_KEY}`
                    );
                    setWeather(weatherRes.data);
                } catch (err) {
                    console.warn("Weather API call failed");
                }
            } catch (err) {
                console.error("Error loading location data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [locationName]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-8 text-xl font-bold text-gray-900 animate-pulse">Exploring {locationName}...</p>
        </div>
    );

    if (!details) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-4">Location Not Found</h2>
                <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Dashboard</button>
            </div>
        </div>
    );

    const tabs = [
        { id: 'overview', label: t('overview'), icon: <Info size={18} /> },
        { id: 'places', label: t('places'), icon: <MapPin size={18} /> },
        { id: 'food', label: t('food'), icon: <Utensils size={18} /> },
        { id: 'hotels', label: t('hotels'), icon: <Hotel size={18} /> },
        { id: 'itinerary', label: t('itinerary'), icon: <Calendar size={18} /> }
    ];

    const bookingOptions = [
        { id: 'flight', label: 'Flights', icon: <Plane size={20} />, price: '$120 - $450' },
        { id: 'train', label: 'Trains', icon: <Train size={20} />, price: '$45 - $120' },
        { id: 'bus', label: 'Bus', icon: <Bus size={20} />, price: '$15 - $60' }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Premium Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <img
                    src={images[0] || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000`}
                    alt={locationName}
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                <div className="absolute top-32 left-8 md:left-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all mb-8 shadow-xl"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>

                <div className="absolute bottom-16 left-8 md:left-20 right-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">Popular Destination</span>
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter leading-none italic">
                            {locationName}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6">
                            {weather && (
                                <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4 text-white hover:bg-white/20 transition-all cursor-default shadow-2xl">
                                    <Cloud size={32} className="text-blue-300" />
                                    <div>
                                        <p className="text-lg font-black">{Math.round(weather.list[0].main.temp)}°C</p>
                                        <p className="text-xs font-medium text-white/70 uppercase tracking-widest">{weather.list[0].weather[0].description}</p>
                                    </div>
                                </div>
                            )}
                            <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4 text-white hover:bg-white/20 transition-all cursor-default shadow-2xl border-white/30 border">
                                <MapPin size={32} className="text-red-400" />
                                <div>
                                    <p className="text-lg font-black">Location</p>
                                    <p className="text-xs font-medium text-white/70 uppercase tracking-widest">Global Travel Map</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sticky Navigation Tabs */}
            <div className="sticky top-24 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-8 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Content Area (8/12) */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-12">
                                        <section>
                                            <h2 className="text-4xl font-black text-gray-900 mb-8 flex items-center gap-4 italic uppercase tracking-tighter">
                                                <div className="w-12 h-1 bg-blue-600 rounded-full"></div> Discover {locationName}
                                            </h2>
                                            <p className="text-xl text-gray-600 leading-relaxed font-medium mb-10">
                                                {details.overview.description}
                                            </p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {details.overview.facts.map((fact, i) => (
                                                    <div key={i} className="card-premium flex items-start gap-4 hover:border-blue-200 group">
                                                        <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
                                                            <Info size={20} />
                                                        </div>
                                                        <p className="font-bold text-gray-800">{fact}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Image Gallery */}
                                        <section>
                                            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase italic">
                                                <Camera size={24} className="text-pink-600" /> Visual Journey
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {images.slice(1, 4).map((img, i) => (
                                                    <div key={i} className={`rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all h-64 ${i === 0 ? 'md:col-span-2' : ''}`}>
                                                        <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'places' && (
                                    <div className="space-y-10">
                                        <h2 className="text-4xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter">Top Landmarks</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {details.attractions.map((attr, i) => (
                                                <div key={i} className="group relative rounded-[2.5rem] overflow-hidden h-[450px] shadow-2xl">
                                                    <img
                                                        src={images[i+1] || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800`}
                                                        alt={attr.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                                        <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest mb-2">
                                                            <Star size={14} fill="currentColor" /> Highly Recommended
                                                        </div>
                                                        <h3 className="text-3xl font-black mb-4">{attr.name}</h3>
                                                        <div className="flex gap-4">
                                                            <span className="dark-glass px-4 py-1.5 rounded-full text-xs font-bold border-white/20">Fee: {attr.fee}</span>
                                                            <span className="dark-glass px-4 py-1.5 rounded-full text-xs font-bold border-white/20">{attr.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'food' && (
                                    <div className="space-y-12">
                                        <h2 className="text-4xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter">Culinary Delights</h2>
                                        <div className="card-premium bg-orange-50/50 border-orange-100 flex flex-col md:flex-row items-center gap-8 mb-12">
                                            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600">
                                                <Coffee size={40} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-2">Food Budget Tip</h3>
                                                <p className="text-gray-600 font-medium">Enjoy a mix of street food and premium dining. Average daily cost is around <span className="text-orange-600 font-bold">{details.food.avgCost}</span>.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="card-premium h-full">
                                                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                                    <CheckCircle size={20} className="text-green-500" /> Must-Try Foods
                                                </h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {details.food.famousFoods.map((f, i) => (
                                                        <span key={i} className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-orange-100 text-gray-800 font-bold hover:shadow-md transition-shadow">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="card-premium h-full">
                                                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                                    <Star size={20} className="text-yellow-500" /> Top Rated Spots
                                                </h3>
                                                <div className="space-y-4">
                                                    {details.food.restaurants.map((r, i) => (
                                                        <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                                            <span className="font-bold">{r.name}</span>
                                                            <span className="bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-black">{r.cost}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'hotels' && (
                                    <div className="space-y-12">
                                        <h2 className="text-4xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter">Luxury & Comfort</h2>
                                        {['luxury', 'midRange', 'budget'].map((category) => (
                                            <section key={category}>
                                                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">{category} Stays</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {details.hotels[category]?.map((h, i) => (
                                                        <div key={i} className="card-premium p-6 hover:translate-x-2 transition-transform border-gray-100 group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                    <Hotel size={24} />
                                                                </div>
                                                                <span className="font-black text-gray-800 text-lg">{h}</span>
                                                                <ChevronRight className="ml-auto text-gray-300" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'itinerary' && (
                                    <div className="space-y-10">
                                        <h2 className="text-4xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter">Smart Trip Plans</h2>
                                        <div className="space-y-6">
                                            {['1 Day Exploration', '3 Day Adventure', '5 Day Immersion'].map((plan, i) => (
                                                <div key={i} className="card-premium relative overflow-hidden group hover:bg-blue-600 transition-colors duration-500">
                                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div>
                                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-white mb-2">{plan}</h3>
                                                            <p className="text-gray-500 group-hover:text-blue-100 font-medium max-w-lg">
                                                                A perfectly balanced schedule covering the best sights, tastes, and culture for a {plan.toLowerCase()} in {locationName}.
                                                            </p>
                                                        </div>
                                                        <button className="bg-blue-600 group-hover:bg-white text-white group-hover:text-blue-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                                                            Get Itinerary
                                                        </button>
                                                    </div>
                                                    <div className="absolute top-0 right-0 -mr-12 -mt-12 opacity-5 scale-150 rotate-12 group-hover:opacity-10 transition-opacity">
                                                        <Navigation size={200} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Widget Area (4/12) */}
                    <div className="lg:col-span-4 space-y-10">
                        
                        {/* Weather Advanced Widget */}
                        {weather && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-3xl shadow-blue-900/40 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Cloud size={100} className="stroke-[1px]" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h3 className="text-3xl font-black italic">{t('weather')}</h3>
                                            <p className="text-indigo-200 uppercase tracking-widest text-xs font-black">{locationName} Weather</p>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                                            <Droplets size={24} className="text-blue-300" />
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-2 mb-10">
                                        <span className="text-8xl font-black leading-none">{Math.round(weather.list[0].main.temp)}°</span>
                                        <span className="text-2xl font-black text-indigo-300 mb-2">C</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between border-b border-white/10 pb-4">
                                            <span className="text-indigo-300 font-bold">CONDITION</span>
                                            <span className="font-black uppercase tracking-tighter">{weather.list[0].weather[0].description}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-4">
                                            <span className="text-indigo-300 font-bold">FEELS LIKE</span>
                                            <span className="font-black uppercase tracking-tighter">{Math.round(weather.list[0].main.feels_like)}°C</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-4">
                                            <span className="text-indigo-300 font-bold">HUMIDITY</span>
                                            <span className="font-black uppercase tracking-tighter">{weather.list[0].main.humidity}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-indigo-300 font-bold">WIND SPEED</span>
                                            <span className="font-black uppercase tracking-tighter">{weather.list[0].wind.speed} km/h</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Ticket Booking Feature (NEW) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="card-premium border-2 border-blue-600/10"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-blue-600 text-white p-3 rounded-2xl">
                                    <Ticket size={24} />
                                </div>
                                <h3 className="text-2xl font-black italic">{t('ticket_booking')}</h3>
                            </div>

                            {/* Booking Switcher */}
                            <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                {bookingOptions.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setBookingType(opt.id)}
                                        className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${bookingType === opt.id
                                                ? 'bg-white shadow-md text-blue-600 scale-105 z-10'
                                                : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {opt.icon}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Pricing</p>
                                    <p className="text-2xl font-black text-blue-900 italic">{bookingOptions.find(o => o.id === bookingType)?.price}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <CheckCircle size={12} fill="currentColor" />
                                        </div>
                                        Direct Connection Available
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <CheckCircle size={12} fill="currentColor" />
                                        </div>
                                        Instant Confirmation
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full btn-primary py-6 text-lg tracking-widest uppercase italic h-20 group"
                            >
                                <span className="flex items-center gap-3">
                                    {t('book_now')} <ArrowLeft className="rotate-180 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>

                            <p className="text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Partnered with MakeMyTrip & Skyscanner</p>
                        </motion.div>

                        {/* Local Expenses Widget */}
                        <div className="card-premium h-48 flex flex-col justify-center border-2 border-gray-50">
                            <h4 className="flex items-center gap-2 mb-4">
                                <Wallet size={18} className="text-gray-900" />
                                <span className="font-black uppercase tracking-widest text-xs italic">{t('local_expenses')}</span>
                            </h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-gray-900">$250</span>
                                <span className="text-gray-500 font-bold">/ Average Person</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Inclusive of food, transport & activities.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationDetail;
