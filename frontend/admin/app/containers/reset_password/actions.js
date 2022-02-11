/*
 *
 * ResetPassword actions
 *
 */

import {
  RESET_PASSWORD,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_SUCCESS,
  CHECK_TOKEN,
  CHECK_TOKEN_ERROR,
  CHECK_TOKEN_SUCCESS,
} from './constants';
import {
  checkToken,
  createNewPass,
} from 'services/api/authService';

function resetPasswordAction() { return { type: RESET_PASSWORD } };
function resetPasswordSuccess(response) { return { type: RESET_PASSWORD_SUCCESS, response } };
function resetPasswordFailed(error) { return { type: RESET_PASSWORD_FAILED, error } };

function checkTokenAction() { return { type: CHECK_TOKEN } };
function checkTokenSuccess(response) { return { type: CHECK_TOKEN_SUCCESS, response } };
function checkTokenFailed(error) { return { type: CHECK_TOKEN_ERROR, error } };

export const resetPassword = (accessToken, data) => {
  return async dispatch => {
    try {
      dispatch(resetPasswordAction());
      const response = await createNewPass(accessToken, data);
      dispatch(resetPasswordSuccess(response.data));
    } catch (error) {
      dispatch(resetPasswordFailed(error.response?.data));
    }
  }
};

export const checkTokenExist = data => {
  return async dispatch => {
    try {
      dispatch(checkTokenAction());
      const res = await checkToken(data);
      dispatch(checkTokenSuccess(res.data));
    } catch (error) {
      dispatch(checkTokenFailed(error.response?.data));
    }
  }
};