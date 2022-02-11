/*
 *
 * Update agency actions
 *
 */

import { 
  UPDATE_AGENCY,
  UPDATE_AGENCY_SUCCESS,
  UPDATE_AGENCY_ERROR,
} from './constants';
import { updateAgencyInfoOnSetup } from 'services/api/agencyService';

export default (accessToken, data) => {
  return async dispatch => {
    try {
      dispatch(updateAgency());
      const response = await updateAgencyInfoOnSetup(accessToken, data);
      dispatch(updateAgencySuccess(response?.data));
    } catch (err) {
      dispatch(updateAgencyError(err.response?.data));
    }
  }
}

function updateAgency() {
  return {
    type: UPDATE_AGENCY,
  };
}

function updateAgencySuccess(response) {
  return {
    type: UPDATE_AGENCY_SUCCESS,
    response
  };
}

function updateAgencyError(error) {
  return {
    type: UPDATE_AGENCY_ERROR,
    error
  };
}