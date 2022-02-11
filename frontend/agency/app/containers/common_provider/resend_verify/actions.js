/*
 *
 * Resend verify actions
 *
 */

import { 
  RESEND_VERIFY,
  RESEND_VERIFY_SUCCESS,
  RESEND_VERIFY_ERROR,
} from './constants';
import { resendVerify } from 'services/api/authService';

export default data => {
  return async dispatch => {
    try {
      dispatch(resendVerifyEmail());
      const response = await resendVerify(data);
      dispatch(resendVerifySuccess(response));
    } catch (err) {
      dispatch(resendVerifyError(err.response?.data));
    }
  }
}

function resendVerifyEmail() {
  return {
    type: RESEND_VERIFY,
  };
}

function resendVerifySuccess(payload) {
  return {
    type: RESEND_VERIFY_SUCCESS,
    payload
  };
}

function resendVerifyError(error) {
  return {
    type: RESEND_VERIFY_ERROR,
    error
  };
}