/*
 *
 * Update agency actions
 *
 */

import { 
  UPDATE_AGENCY,
  UPDATE_AGENCY_SUCCESS,
  UPDATE_AGENCY_ERROR,
  CLEAR_UPDATE_AGENCY
} from './constants';
import { updateAgencyInfo } from 'services/api/agencyService';

export default data => {
  return async dispatch => {
    try {
      dispatch(updateAgency(data));
      const response = await updateAgencyInfo(data);
      dispatch(updateAgencySuccess(response));
    } catch (err) {
      dispatch(updateAgencyError(err.response?.data));
    }
  }
}

export function clearUpdateAgencyAction() {
  return {
    type: CLEAR_UPDATE_AGENCY,
  }
}

function updateAgency(payload) {
  return {
    type: UPDATE_AGENCY,
    payload
  };
}

function updateAgencySuccess(payload) {
  return {
    type: UPDATE_AGENCY_SUCCESS,
    payload
  };
}

function updateAgencyError(error) {
  return {
    type: UPDATE_AGENCY_ERROR,
    error
  };
}