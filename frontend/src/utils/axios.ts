import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add a request interceptor to include CSRF token
instance.interceptors.request.use(async (config) => {
    // Don't add CSRF token for csrf-cookie endpoint
    if (config.url === '/sanctum/csrf-cookie') {
        return config;
    }
    
    // Get CSRF token from cookie
    const token = getCsrfToken();
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }
    return config;
});

// Function to get CSRF token from cookie
function getCsrfToken(): string | null {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

// Initialize CSRF token by calling sanctum/csrf-cookie
export const initializeCsrf = async () => {
    try {
        // Make sure we're using the right domain for the CSRF cookie
        await instance.get('/sanctum/csrf-cookie', {
            baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        });
        
        // Wait a bit to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const token = getCsrfToken();
        if (token) {
            instance.defaults.headers.common['X-XSRF-TOKEN'] = token;
        }
    } catch (error) {
        console.error('Failed to initialize CSRF token:', error);
    }
};

export default instance;
