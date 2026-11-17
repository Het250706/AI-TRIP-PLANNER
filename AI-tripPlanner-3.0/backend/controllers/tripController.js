import Trip from '../models/tripModel.js';
import { generateTripItinerary } from '../services/openaiService.js';

// @desc    Generate AI Trip Itinerary
// @route   POST /api/trip/generate
// @access  Private
export const generateTrip = async (req, res, next) => {
    try {
        const { destination, startDate, endDate, budget, preferences } = req.body;

        if (!destination || !startDate || !endDate || !budget) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const aiResponse = await generateTripItinerary(destination, startDate, endDate, budget, preferences);

        res.status(200).json({
            success: true,
            data: aiResponse
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Save Trip to Database
// @route   POST /api/trip/save
// @access  Private
export const saveTrip = async (req, res, next) => {
    try {
        const { destination, startDate, endDate, budget, preferences, itinerary, tripName } = req.body;

        const newTrip = new Trip({
            userId: req.user._id, // Assuming req.user is populated by isLoggedIn middleware
            destination,
            startDate,
            endDate,
            budget,
            preferences,
            itinerary,
            tripName // I'll add this to the model
        });

        const savedTrip = await newTrip.save();

        res.status(201).json({
            success: true,
            data: savedTrip
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Trips for User
// @route   GET /api/trip/all
// @access  Private
export const getTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Single Trip by ID
// @route   GET /api/trip/:id
// @access  Private
export const getTripById = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        // Check ownership
        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to view this trip." });
        }

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete Trip
// @route   DELETE /api/trip/:id
// @access  Private
export const deleteTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: "Trip not found" });
        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await Trip.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Trip deleted" });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Location Details
// @route   GET /api/trip/location-details/:name
// @access  Private
import { generateLocationDetails } from '../services/openaiService.js';
export const getLocationDetails = async (req, res, next) => {
    try {
        const details = await generateLocationDetails(req.params.name);
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        next(error);
    }
};
