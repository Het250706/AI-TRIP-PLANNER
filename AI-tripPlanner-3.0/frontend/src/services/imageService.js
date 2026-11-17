import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const fetchLocationImages = async (query, count = 10) => {
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("Unsplash Access Key is missing. Using placeholder images.");
        return Array.from({ length: count }, (_, i) => `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop`);
    }

    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: `${query} travel landmark`,
                per_page: count,
                order_by: 'relevant'
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        return response.data.results.map(img => img.urls.regular);
    } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
        return [];
    }
};
