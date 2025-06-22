import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add request interceptor to log the full URL
api.interceptors.request.use((config) => {
    console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            baseURL: error.config?.baseURL
        });
        return Promise.reject(error);
    }
);

export default api;



