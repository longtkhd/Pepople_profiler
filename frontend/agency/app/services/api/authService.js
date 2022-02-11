import API from './index';
import { API_KEY } from 'constants/config';

const AUTH_KEY = API_KEY.AUTH_KEY;
const LOGIN_KEY = '/signin';
const REGISTER_AGENCY_KEY = '/register';
const CREATE_PASSWORD_KEY = '/createPass';
const CHANGE_PASSWORD_KEY = '/changePass';
const RESEND_VERIFY_KEY = '/resendVerify';
const FORGOT_PASSWORD_KEY = '/forgotPass';
const CHECK_TOKEN_KEY = '/checkToken';
const USER_INFO_KEY = '/userInfo';

export const login = params => {
  return API.post(AUTH_KEY + LOGIN_KEY, params);
};

export const registerAgency = params => {
  return API.post(AUTH_KEY + REGISTER_AGENCY_KEY, params);
};

export const getUserInfo = () => {
  return API.get(AUTH_KEY + USER_INFO_KEY);
};

export const createPassword = (params) => {
  return API.post(AUTH_KEY + CREATE_PASSWORD_KEY, params);
};

export const createPasswordOnSetup = (accessToken, params) => {
  return API.post(AUTH_KEY + CREATE_PASSWORD_KEY, params, { headers: { authorization: `Bearer ${accessToken}` } });
};

export const changePassword = params => {
  return API.post(AUTH_KEY + CHANGE_PASSWORD_KEY, params);
};

export const resendVerify = params => {
  return API.post(AUTH_KEY + RESEND_VERIFY_KEY, params);
};

export const forgotPassword = params => {
  return API.post(AUTH_KEY + FORGOT_PASSWORD_KEY, params);
};

export const checkToken = params => {
  return API.post(AUTH_KEY + CHECK_TOKEN_KEY, params);
};

export const createNewPass = (accessToken, payload) => {
  return API.post(AUTH_KEY + CREATE_PASSWORD_KEY, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
};
