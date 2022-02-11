/*
 *
 * LoginPage actions
 *
 */

import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  CLEAR_USER_DATA,
} from './constants';
import { login } from 'services/api/authService';
// import { login } from 'services/api/adminService';


function loginUser(payload) {
  return {
    type: LOGIN,
    payload
  };
}

function loginSuccess(response) {
  return {
    type: LOGIN_SUCCESS,
    response
  };
}

function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  };
}

function clearUserDataAction() {
  return {
    type: CLEAR_USER_DATA
  }
};

export default userData => {
  return async dispatch => {
    try {
      dispatch(loginUser());
      const response = await login(userData);
      dispatch(loginSuccess(response.data?.data));
    } catch (err) {
      dispatch(loginError(err.response?.data));
    }
  }
}

export const clearUserData = () => {
  return dispatch => {
    dispatch(clearUserDataAction());
  }
}