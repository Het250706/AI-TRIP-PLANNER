import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { outline, world } from '../assets/assets';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { fetchMultiplePlaceImages } from '../services/unsplashService';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Compass, Zap, MapPin } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [placeImages, setPlaceImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    fetchRecommendations();
    if (user) fetchSavedPlaces();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await getRecommendationsFromAPI(latitude, longitude);
          },
          async () => {
            setLocationError(true);
            await getRecommendationsFromAPI();
          }
        );
      } else {
        await getRecommendationsFromAPI();
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setLoading(false);
    }
  };

  const getRecommendationsFromAPI = async (lat = null, lng = null) => {
    try {
      const params = lat && lng ? { lat, lng } : {};
      const response = await api.get('/api/users/recommendations', { params });
      const recs = response.data.recommendations;
      setRecommendations(recs);
      const places = [recs.local, recs.national, recs.international];
      const images = await fetchMultiplePlaceImages(places);
      setPlaceImages(images);
    } catch (error) {
      console.error("Error fetching recommendations API:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPlaces = async () => {
    try {
      const response = await api.get('/api/users/savedplaces');
      setSavedPlaces(response.data.savedPlaces || []);
    } catch (error) {
      console.error("Error fetching saved places:", error);
    }
  };

  const handleSavePlace = async (place, e) => {
    e.stopPropagation();
    if (!user) { alert("Please login to save places!"); return; }
    try {
      const isAlreadySaved = savedPlaces.some(p => p.name === place.name && p.address === place.location);
      if (isAlreadySaved) {
        const savedPlace = savedPlaces.find(p => p.name === place.name && p.address === place.location);
        await api.delete(`/api/users/saveplace/${savedPlace._id}`);
        setSavedPlaces(savedPlaces.filter(p => p._id !== savedPlace._id));
      } else {
        const response = await api.post('/api/users/saveplace', {
          name: place.name, lat: 0, lng: 0, rating: place.rating || 0,
          address: place.location, types: [place.category]
        });
        setSavedPlaces([...savedPlaces, response.data.place]);
      }
    } catch (error) { console.error("Error saving/unsaving:", error); }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden">
      <main className="pt-28">
        {/* Welcome Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">Welcome Back, {user?.fullname?.split(' ')[0] || 'Traveler'}</span>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
                Discover your <br />
                <span className="text-blue-600 italic">next masterpiece.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-xl mb-10 font-medium">
                Our AI has curated these destinations just for you based on
                your travel patterns and current trends.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-trip')}
                className="bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-lg shadow-2xl flex items-center gap-3"
              >
                <Plus size={24} /> Plan New Adventure
              </motion.button>
            </div>

            <div className="flex-1 relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="relative z-10"
              >
                <img src={world} alt="World" className="w-full h-auto drop-shadow-2xl" />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 blur-[100px] rounded-full -z-10"></div>
            </div>
          </motion.div>
        </section>

        {/* Categories / Smart Suggestions */}
        <section className="bg-white py-24 rounded-[60px] shadow-sm border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                  <Zap className="text-yellow-500 fill-yellow-500" /> AI Suggestions
                </h2>
                <p className="text-gray-500 font-medium">Locally to globally, we've found the best spots for you.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-gray-50 text-gray-900 font-bold rounded-xl border border-gray-200 text-sm hover:bg-gray-100 transition-all">Near You</button>
                <button className="px-6 py-2 bg-gray-50 text-gray-900 font-bold rounded-xl border border-gray-200 text-sm hover:bg-gray-100 transition-all">Trending</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              <img src={outline} className="absolute -top-40 left-0 w-full opacity-5 pointer-events-none" alt="" />

              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-[450px] bg-gray-100 rounded-[40px] animate-pulse"></div>)
              ) : recommendations ? (
                [
                  { ...recommendations.local, type: 'Local', icon: <MapPin className="text-blue-500" /> },
                  { ...recommendations.national, type: 'National', icon: <Compass className="text-green-500" /> },
                  { ...recommendations.international, type: 'Global', icon: <Zap className="text-purple-500" /> }
                ].map((place, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    onClick={() => navigate(`/location/${place.name}`)}
                    className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer flex flex-col"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={placeImages[place.name] || `https://source.unsplash.com/800x600/?${place.name},travel`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={place.name}
                      />
                      <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
                        {place.icon} {place.type}
                      </div>
                      <button
                        onClick={(e) => handleSavePlace(place, e)}
                        className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:bg-blue-600 hover:text-white transition-all text-gray-400"
                      >
                        {user && savedPlaces.some(p => p.name === place.name) ? <FaBookmark className="text-blue-600" /> : <FaRegBookmark />}
                      </button>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{place.name}</h3>
                      <p className="text-gray-500 font-bold text-sm mb-4 uppercase tracking-tighter">{place.location}</p>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">{place.description}</p>

                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-yellow-500 font-black">⭐ {place.rating?.toFixed(1) || '4.5'}</span>
                        <span className="text-blue-600 font-black text-sm group-hover:underline underline-offset-4">Explore Details</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : null}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
