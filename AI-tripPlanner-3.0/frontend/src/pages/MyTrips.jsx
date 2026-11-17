import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { FiClock, FiCalendar, FiMapPin, FiDollarSign, FiSearch, FiFilter, FiTrash2, FiEdit2, FiPlus, FiChevronRight, FiGrid, FiList } from "react-icons/fi";
import { useAuth } from '../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MyTrips = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    useEffect(() => {
        const fetchTrips = async () => {
            if (!user) return;
            try {
                const response = await api.get("/api/trip/all");
                setTrips(response.data.data);
                setFilteredTrips(response.data.data);
            } catch (err) {
                console.error("Error fetching trips:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [user]);

    useEffect(() => {
        let result = [...trips];

        if (searchTerm) {
            result = result.filter(trip =>
                trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== "all") {
            result = result.filter(trip => trip.status?.toLowerCase() === filterStatus.toLowerCase());
        }

        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

        setFilteredTrips(result);
    }, [searchTerm, filterStatus, sortBy, trips]);

    const handleDeleteTrip = async (e, tripId) => {
        e.stopPropagation();
        if (!window.confirm("Delete this memory forever?")) return;

        try {
            await api.delete(`/api/trip/${tripId}`);
            setTrips(trips.filter(trip => trip._id !== tripId));
        } catch (err) {
            alert("Failed to delete trip");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Flexible";
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-gray-500">Loading your adventures...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f1f5f9] pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl font-black text-gray-900 mb-4 tracking-tighter"
                        >
                            {t('my_trips')}
                        </motion.h1>
                        <p className="text-gray-500 font-medium">Your personal travel history and upcoming escapes.</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/create-trip")}
                        className="btn-primary shadow-2xl shadow-blue-600/30 px-10"
                    >
                        <FiPlus size={20} /> {t('create_trip')}
                    </motion.button>
                </div>

                {/* Filters Row */}
                <div className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-3xl shadow-sm flex flex-col lg:flex-row gap-4 mb-10">
                    <div className="relative flex-grow">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your destinations..."
                            className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-800 placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            className="px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700 cursor-pointer shadow-sm"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Everywhere</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            className="px-6 py-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 font-bold text-gray-700 cursor-pointer shadow-sm"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Recent First</option>
                            <option value="oldest">Oldest First</option>
                        </select>

                        <div className="flex bg-white rounded-2xl p-1 shadow-sm">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400'}`}
                            >
                                <FiGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-xl transition-all ${viewMode === "list" ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400'}`}
                            >
                                <FiList size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trips Grid */}
                {filteredTrips.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100"
                    >
                        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FiMapPin size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No adventures found</h2>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
                            Ready to start your next chapter? Let AI plan it for you in seconds.
                        </p>
                        <button
                            onClick={() => navigate("/create-trip")}
                            className="btn-primary min-w-[200px]"
                        >
                            Start Planning
                        </button>
                    </motion.div>
                ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
                        <AnimatePresence>
                            {filteredTrips.map((trip) => (
                                <motion.div
                                    key={trip._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => navigate(`/trips/${trip._id}`)}
                                    className={`group cursor-pointer bg-white overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:scale-[1.02] border border-transparent hover:border-blue-100 ${viewMode === "grid" ? 'rounded-[2.5rem] flex flex-col' : 'rounded-3xl flex items-center p-4 pr-10'
                                        }`}
                                >
                                    {/* Image Section */}
                                    <div className={`relative overflow-hidden ${viewMode === "grid" ? 'h-64' : 'w-48 h-32 rounded-2xl flex-shrink-0'}`}>
                                        <img
                                            src={trip.coverImage || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop`}
                                            alt={trip.destination}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                                        <div className="absolute top-4 left-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 ${trip.status === 'completed' ? 'bg-green-500/80 text-white' : 'bg-blue-500/80 text-white'
                                                }`}>
                                                {trip.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className={`${viewMode === "grid" ? 'p-8 flex-grow' : 'px-8 flex-grow flex items-center justify-between'}`}>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {trip.destination}
                                            </h2>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm font-bold text-gray-500">
                                                <span className="flex items-center gap-2"><FiCalendar className="text-blue-600" /> {formatDate(trip.startDate)}</span>
                                                <span className="flex items-center gap-2 capitalize"><FiDollarSign className="text-green-600" /> {trip.budget}</span>
                                            </div>
                                        </div>

                                        {viewMode === "grid" && (
                                            <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8 italic">
                                                A custom {trip.budget} trip exploring the best landmarks and cultural spots.
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex -space-x-3">
                                                {trip.preferences?.slice(0, 3).map((pref, i) => (
                                                    <div key={i} className="w-10 h-10 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-blue-600 uppercase">
                                                        {pref.charAt(0)}
                                                    </div>
                                                ))}
                                                {trip.preferences?.length > 3 && (
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-gray-500">
                                                        +{trip.preferences.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={(e) => handleDeleteTrip(e, trip._id)}
                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                                <span className="text-blue-600 font-black text-sm flex items-center gap-1 group-hover:gap-3 transition-all uppercase tracking-widest">
                                                    {viewMode === "grid" ? "Details" : ""} <FiChevronRight />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
