// config/publicAxios.ts
import axios from 'axios';
import { API_CONFIG, DEFAULT_HEADERS, API_TIMEOUT } from './apiConfig';

const publicAxios = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: DEFAULT_HEADERS,
    timeout: API_TIMEOUT,
});

export default publicAxios;
