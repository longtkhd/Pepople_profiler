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