import Cookies from 'js-cookie';
import * as jwtDecode from 'jwt-decode';
import { CONFIG } from 'constants/config';

const token_key = CONFIG.TOKEN;

const getToken = () => {
  return Cookies.get(token_key);
};

const setToken = (token) => {
  const { accessToken, expiresIn } = token;
  Cookies.set(token_key, accessToken, { expires: expiresIn / 86400 });
}

const removeToken = () => {
  Cookies.remove(token_key);
}

const isValidToken = () => {
  if (!getToken()) return false;
  try {
    const jwt = jwtDecode(getToken());
    return Date.now() / 1000 < jwt.exp;
  } catch (e) {
    return false;
  }
}

const getUserInfo = () => {
  try {
    const userData = jwtDecode(getToken());
    return userData;
  } catch (e) {
    return;
  }
}

export {
  getToken,
  setToken,
  removeToken,
  isValidToken,
  getUserInfo,
}
