import axios from 'axios';
import { getToken } from '../authentication';

const axiosReq = axios.create({
  baseURL: process.env.API_URL
});

if (getToken()) {
  axiosReq.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
}

export default axiosReq;
