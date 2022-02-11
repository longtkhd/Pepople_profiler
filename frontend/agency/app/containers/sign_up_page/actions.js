/*
 *
 * SignUpPage actions
 *
 */

import { 
  REGISTER_AGENCY_ADMIN,
  REGISTER_AGENCY_ADMIN_SUCCESS,
  REGISTER_AGENCY_ADMIN_ERROR,
  RESET
} from './constants';
import { registerAgency } from 'services/api/authService';

export default data => {
  return async dispatch => {
    try {
      dispatch(registerAgencyAdmin());
      const response = await registerAgency(data);
      dispatch(registerAgencyAdminSuccess(response.data));
    } catch (err) {
      dispatch(registerAgencyAdminError(err.response?.data));
    }
  }
}

function registerAgencyAdmin() {
  return {
    type: REGISTER_AGENCY_ADMIN,
  };
}

function registerAgencyAdminSuccess(response) {
  return {
    type: REGISTER_AGENCY_ADMIN_SUCCESS,
    response
  };
}

function registerAgencyAdminError(error) {
  return {
    type: REGISTER_AGENCY_ADMIN_ERROR,
    error
  };
}
export function resetSignUpPage() {
  return {
    type: RESET,
  };
}
