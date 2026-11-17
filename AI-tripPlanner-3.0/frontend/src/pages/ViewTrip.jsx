import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import api from "../services/api";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MapPin, Calendar, Clock, Navigation,
  Trash2, Image as ImageIcon, ExternalLink,
  ChevronLeft, ChevronRight, Info, Plane
} from 'lucide-react';
import { FiMapPin } from "react-icons/fi";

// Custom hook to load Google Maps
const useLoadGoogleMaps = (apiKey) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, [apiKey]);

  return loaded;
};

// Day Colors
const dayColors = [
  "#FF5252", "#4285F4", "#0F9D58", "#FF9800", "#9C27B0", "#00BCD4",
];

const ViewTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripId } = useParams();
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [error, setError] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [destinationImage, setDestinationImage] = useState("");
  const [placeImages, setPlaceImages] = useState({});
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [flightResults, setFlightResults] = useState([]);
  const [searchingFlights, setSearchingFlights] = useState(false);
  const [loading, setLoading] = useState({
    destinationImage: true,
    placeImages: true,
  });

  const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleMapsLoaded = useLoadGoogleMaps(googleMapsApiKey);

  const fetchSavedPlaces = async () => {
    if (!user) return;
    try {
      const response = await api.get("/api/users/savedplaces");
      setSavedPlaces(response.data.savedPlaces || []);
    } catch (error) {
      console.error("Error fetching saved places:", error);
    }
  };

  const handleSavePlace = async (place) => {
    if (!user) { alert("Please login to save places!"); return; }
    try {
      const isAlreadySaved = savedPlaces.some(p => p.name === place.name);
      if (isAlreadySaved) {
        const savedPlace = savedPlaces.find(p => p.name === place.name);
        await api.delete(`/api/users/saveplace/${savedPlace._id}`);
        setSavedPlaces(savedPlaces.filter(p => p._id !== savedPlace._id));
      } else {
        const response = await api.post("/api/users/saveplace", {
          name: place.name, lat: place.lat, lng: place.lng,
          rating: place.rating || 0, address: place.address, types: place.types || []
        });
        setSavedPlaces([...savedPlaces, response.data.place]);
      }
    } catch (error) { console.error("Error saving place:", error); }
  };

  const fetchDestinationImage = async (destination) => {
    try {
      setLoading(prev => ({ ...prev, destinationImage: true }));
      const response = await axios.get(`https://api.unsplash.com/photos/random`, {
        params: { query: `${destination} city`, orientation: "landscape", client_id: unsplashAccessKey }
      });
      setDestinationImage(response.data.urls.regular);
    } catch (error) {
      setDestinationImage(`https://source.unsplash.com/1600x900/?travel,${destination}`);
    } finally {
      setLoading(prev => ({ ...prev, destinationImage: false }));
    }
  };

  const fetchPlaceImages = async () => {
    const images = {};
    try {
      setLoading(prev => ({ ...prev, placeImages: true }));
      for (const dayPlan of recommendations) {
        for (const place of dayPlan.places) {
          try {
            const response = await axios.get("https://api.unsplash.com/photos/random", {
              params: { query: `${place.name} ${tripDetails.destination}`, client_id: unsplashAccessKey }
            });
            images[place.name] = response.data.urls.small;
          } catch { images[place.name] = `https://source.unsplash.com/200x200/?landmark`; }
        }
      }
    } finally {
      setPlaceImages(images);
      setLoading(prev => ({ ...prev, placeImages: false }));
    }
  };

  const handleSearchFlights = async () => {
    setSearchingFlights(true);
    setIsFlightModalOpen(true);
    setTimeout(() => {
      const mocks = [
        { id: 1, airline: "Air India", price: "₹45,000", time: "10:30 AM - 2:00 PM", duration: "3h 30m", type: "Non-stop" },
        { id: 2, airline: "Indigo", price: "₹38,500", time: "1:00 PM - 4:45 PM", duration: "3h 45m", type: "Non-stop" },
        { id: 3, airline: "Vistara", price: "₹52,000", time: "8:00 AM - 11:30 AM", duration: "3h 30m", type: "Non-stop" }
      ];
      setFlightResults(mocks);
      setSearchingFlights(false);
    }, 2000);
  };

  const fetchTripById = async (id) => {
    try {
      const response = await api.get(`/api/trip/${id}`);
      const trip = response.data.data;
      setRecommendations(trip.itinerary);
      setTripDetails({
        destination: trip.destination,
        budget: trip.budget,
        interests: trip.preferences || []
      });
      fetchDestinationImage(trip.destination);
      fetchSavedPlaces();
    } catch (error) {
      setError("Failed to load trip details.");
    }
  };

  useEffect(() => {
    if (location.state) {
      setRecommendations(location.state.itinerary);
      setTripDetails(location.state.tripDetails);
      fetchDestinationImage(location.state.tripDetails.destination);
      fetchSavedPlaces();
    } else if (tripId && user) {
      fetchTripById(tripId);
    } else {
      setError("No trip data found.");
    }
  }, [location.state, tripId, user]);

  useEffect(() => {
    if (recommendations && tripDetails) fetchPlaceImages();
  }, [recommendations, tripDetails]);

  const allPlaces = recommendations?.flatMap((dayPlan) =>
    dayPlan.places.map((place) => ({ ...place, day: dayPlan.day }))
  ) || [];

  const mapCenter = allPlaces.length ? { lat: allPlaces[0].lat, lng: allPlaces[0].lng } : { lat: 0, lng: 0 };

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-32 text-center">
      <div className="bg-white p-12 rounded-[40px] shadow-xl max-w-md w-full">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => navigate("/create-trip")} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg">Plan New Trip</button>
      </div>
    </div>
  );

  if (!recommendations || !tripDetails) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Brewing your itinerary...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen pt-28">
      <div className="flex flex-1 overflow-hidden">
        {/* LIST PANEL */}
        <div className="w-full lg:w-1/2 overflow-y-auto px-6 pb-20 scrollbar-hide">
          <div className="relative h-[300px] w-full rounded-[40px] overflow-hidden mb-8 shadow-lg group">
            {loading.destinationImage ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img src={destinationImage} alt={tripDetails.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-10 cursor-pointer" onClick={() => navigate(`/location/${tripDetails.destination}`)}>
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Your Destination</p>
                <h1 className="text-5xl font-black text-white hover:underline decoration-blue-500 underline-offset-8">{tripDetails.destination}</h1>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Plane size={80} />
              </div>
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={handleSearchFlights} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"><Plane size={18} /> Book Flights</button>
                <button onClick={() => navigate(`/location/${tripDetails.destination}`)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"><Info size={18} /> City Insights</button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Trip Preferences</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-100 capitalize">{tripDetails.budget}</span>
                {tripDetails.interests.map((int, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">{int}</span>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-8">Adventure Timeline</h2>
          <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-1 before:bg-gray-100">
            {recommendations.map((dayPlan, index) => (
              <div key={index} className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center z-10 font-black text-gray-900 overflow-hidden" style={{ color: dayColors[index % dayColors.length] }}>
                  {dayPlan.day}
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: dayColors[index % dayColors.length] }}></div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">Day {dayPlan.day}</h3>
                <p className="text-gray-500 font-medium mb-6 italic">Featured theme: {dayPlan.theme || "Exploration"}</p>

                <div className="space-y-6">
                  {dayPlan.places.map((place, idx) => (
                    <motion.div whileHover={{ x: 10 }} key={idx} className="bg-white p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row gap-6 group">
                      <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                        <img src={placeImages[place.name] || `https://source.unsplash.com/featured/?${place.name}`} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-black text-gray-900">{place.name}</h4>
                          <div className="flex gap-2">
                            <button onClick={() => handleSavePlace(place)} className={`p-2 rounded-xl transition-all ${savedPlaces.some(p => p.name === place.name) ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-blue-600'}`}>
                              <FaBookmark size={14} />
                            </button>
                            <button onClick={() => window.open(`https://www.google.com/maps?q=${place.lat},${place.lng}`, "_blank")} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all">
                              <Navigation size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{place.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
                          <span className="flex items-center gap-1 text-blue-600"><Clock size={12} /> {place.recommendedTime}</span>
                          <span className="flex items-center gap-1 text-yellow-500">⭐ {place.rating}</span>
                          <span className="flex items-center gap-1 truncate max-w-[150px]"><MapPin size={12} /> {place.address}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAP PANEL */}
        <div className="hidden lg:block lg:w-1/2 h-full sticky top-0 bg-gray-100 rounded-l-[60px] overflow-hidden shadow-inner p-4">
          {isGoogleMapsLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "40px" }}
              center={mapCenter}
              zoom={12}
              onLoad={setMap}
            >
              {allPlaces.map((place, idx) => (
                <Marker
                  key={idx}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => setActiveMarker(place)}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: dayColors[place.day % dayColors.length],
                    fillOpacity: 1,
                    strokeColor: "#fff",
                    strokeWeight: 2,
                    scale: 2,
                    anchor: new window.google.maps.Point(12, 24)
                  }}
                />
              ))}

              {activeMarker && (
                <InfoWindow position={{ lat: activeMarker.lat, lng: activeMarker.lng }} onCloseClick={() => setActiveMarker(null)}>
                  <div className="p-2 max-w-[200px]">
                    <h4 className="font-black text-gray-900 mb-1">{activeMarker.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">Day {activeMarker.day} • {activeMarker.recommendedTime}</p>
                    <button onClick={() => window.open(`https://www.google.com/maps?q=${activeMarker.lat},${activeMarker.lng}`, "_blank")} className="w-full bg-blue-600 text-white text-[10px] py-1 rounded-lg font-bold">Directions</button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">Loading Map Satellite...</div>
          )}
        </div>
      </div>

      {/* Flight Modal */}
      <AnimatePresence>
        {isFlightModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="bg-blue-600 p-8 text-white relative flex items-center gap-4">
                <button onClick={() => setIsFlightModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><Plus size={20} className="rotate-45" /></button>
                <div className="p-3 bg-white/20 rounded-2xl"><Plane size={24} /></div>
                <div><h2 className="text-3xl font-black">Best Flights</h2><p className="text-blue-100 opacity-80">To {tripDetails.destination}</p></div>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {searchingFlights ? (
                  <div className="py-20 flex flex-col items-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div><p className="font-bold text-gray-900">Locating carriers...</p></div>
                ) : (
                  <div className="space-y-4">
                    {flightResults.map(f => (
                      <div key={f.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                        <div>
                          <p className="font-black text-gray-900 text-lg">{f.airline}</p>
                          <p className="text-gray-500 text-xs font-bold uppercase">{f.time} • {f.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-blue-600">{f.price}</p>
                          <button className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewTrip;
