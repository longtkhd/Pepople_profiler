import Cookies from 'js-cookie';
import * as jwtDecode from 'jwt-decode';
import { CONFIG } from 'constants/config';

const token_key = CONFIG.TOKEN;

const getToken = () => {
  return Cookies.get(token_key);
};

const setToken = token => {
  const { accessToken, expiresIn } = token;
  Cookies.set(token_key, accessToken, { expires: expiresIn / 86400 });
  storeCurrentUserInfo(token);
};

const removeToken = () => {
  Cookies.remove(token_key);
  localStorage.removeItem('UserInfo');
};

const isValidToken = () => {
  if (!getToken()) return false;
  try {
    const jwt = jwtDecode(getToken());
    return Date.now() / 1000 < jwt.exp;
  } catch (e) {
    return false;
  }
};

const getUserInfo = () => {
  try {
    const cacheData = localStorage.getItem('UserInfo');
    if (cacheData) {
      return JSON.parse(cacheData);
    }
  } catch (e) {}
  try {
    const userData = jwtDecode(getToken());
    return userData;
  } catch (e) {
    return;
  }
};
const storeCurrentUserInfo = token => {
  if (isValidToken()) {
    const jwt = jwtDecode(getToken());
    localStorage.setItem('UserInfo', JSON.stringify(jwt));
  }
};
const cacheCurrentUserInfo = updatedObject => {
  const jwt = jwtDecode(getToken());
  localStorage.setItem(
    'UserInfo',
    JSON.stringify({ ...jwt, ...updatedObject }),
  );
};
export {
  getToken,
  setToken,
  removeToken,
  isValidToken,
  getUserInfo,
  cacheCurrentUserInfo,
};
