import express from 'express';
import {
    generateTrip,
    saveTrip,
    getTrips,
    getTripById
} from '../controllers/tripController.js';
import isLoggedIn from '../middlewares/isloggedin.js';

const router = express.Router();

// All routes are protected
router.use(isLoggedIn);

router.post('/generate', generateTrip);
router.post('/save', saveTrip);
router.get('/all', getTrips);
router.get('/:id', getTripById);

export default router;
