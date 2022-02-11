import { SEND_EMAIL, SEND_EMAIL_SUCCESS, SEND_EMAIL_FAILED } from './constants';
import { forgotPassword } from 'services/api/authService';

function sendEmail() {
  return {
    type: SEND_EMAIL,
  };
}

function sendEmailSuccess(response) {
  return {
    type: SEND_EMAIL_SUCCESS,
    response,
  };
}

function senEmailFailed(error) {
  return {
    type: SEND_EMAIL_FAILED,
    error,
  };
}

export default data => {
  return async dispatch => {
    dispatch(sendEmail());
    try {
      const response = await forgotPassword(data);
      if (response.data?.success) {
        dispatch(sendEmailSuccess(response.data));
      } else {
        dispatch(senEmailFailed(response.data?.error));
      }
    } catch (error) {
      dispatch(senEmailFailed(error.response?.data));
    }  
  };
};
