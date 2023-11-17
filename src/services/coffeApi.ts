import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { VITE_HOST } = getEnvVariables();

// Creamos una función que devuelve la instancia de axios con el host deseado
const createAxiosInstance = (baseURL: string) => {
    const instance = axios.create({
        baseURL: `${baseURL}api`
    });

    instance.interceptors.request.use((request) => {
        // const token = localStorage.getItem(`token`);
        // if (token) request.headers.set('token', token);
        return request;
    });

    return instance;
};

export const coffeApi = createAxiosInstance(VITE_HOST);
