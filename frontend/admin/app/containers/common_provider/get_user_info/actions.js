/*
 *
 * Get user info actions
 *
 */

import {
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_ERROR,
} from './constants';
import { getUserInfo } from 'services/api/authService';

export default () => {
  return async dispatch => {
    try {
      dispatch(getUserInfoAction());
      const response = await getUserInfo();
      dispatch(getUserInfoSuccess(response.data));
    } catch (err) {
      dispatch(getUserInfoError(err.response?.data));
    }
  }
}

function getUserInfoAction() {
  return {
    type: GET_USER_INFO,
  };
}

function getUserInfoSuccess(payload) {
  return {
    type: GET_USER_INFO_SUCCESS,
    payload
  };
}

function getUserInfoError(error) {
  return {
    type: GET_USER_INFO_ERROR,
    error
  };
}