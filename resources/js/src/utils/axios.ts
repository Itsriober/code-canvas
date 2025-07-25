import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default instance;
