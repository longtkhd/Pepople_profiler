import API from './index';
import { getToken } from '../authentication';

export const setAuthorizationHeader = () => {
  API.defaults.headers.common['Authorization'] = 'Bearer ' + getToken();
}