import express from 'express';
import {
    generateTrip,
    saveTrip,
    getTrips,
    getTripById,
    deleteTrip,
    getLocationDetails
} from '../controllers/tripController.js';
import isLoggedIn from '../middlewares/isloggedin.js';

const router = express.Router();

// Public routes
router.get('/location-details/:name', getLocationDetails);

// All other routes are protected
router.use(isLoggedIn);

router.post('/generate', generateTrip);
router.post('/save', saveTrip);
router.get('/all', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);

export default router;
