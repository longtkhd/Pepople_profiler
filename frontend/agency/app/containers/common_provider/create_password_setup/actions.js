/*
 *
 * Create password actions
 *
 */

import { 
  CREATE_PASSWORD,
  CREATE_PASSWORD_SUCCESS,
  CREATE_PASSWORD_ERROR,
} from './constants';
import { createPasswordOnSetup } from 'services/api/authService';

export default (accessToken, data) => {
  return async dispatch => {
    try {
      dispatch(createPassword());
      const response = await createPasswordOnSetup(accessToken, data);
      dispatch(createPasswordSuccess(response.data));
    } catch (err) {
      dispatch(createPasswordError(err.response?.data));
    }
  }
}

function createPassword(payload) {
  return {
    type: CREATE_PASSWORD,
    payload
  };
}

function createPasswordSuccess(response) {
  return {
    type: CREATE_PASSWORD_SUCCESS,
    response
  };
}

function createPasswordError(error) {
  return {
    type: CREATE_PASSWORD_ERROR,
    error
  };
}