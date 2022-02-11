/*
 *
 * SetupAgencyPage actions
 *
 */

import { 
  CHECK_TOKEN,
  CHECK_TOKEN_SUCCESS,
  CHECK_TOKEN_ERROR
} from './constants';
import { checkToken } from 'services/api/authService';

export default data => {
  return async dispatch => {
    try {
      dispatch(checkUserToken(data));
      const response = await checkToken(data);
      dispatch(checkUserTokenSuccess(response.data));
    } catch (err) {
      dispatch(checkUserTokenError(err.response?.data));
    }
  }
}

function checkUserToken(payload) {
  return {
    type: CHECK_TOKEN,
    payload
  };
}

function checkUserTokenSuccess(payload) {
  return {
    type: CHECK_TOKEN_SUCCESS,
    payload
  };
}

function checkUserTokenError(error) {
  return {
    type: CHECK_TOKEN_ERROR,
    error
  };
}