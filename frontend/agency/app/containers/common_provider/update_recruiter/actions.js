/*
 *
 * Update recruiter actions
 *
 */

import { 
  UPDATE_RECRUITER,
  UPDATE_RECRUITER_SUCCESS,
  UPDATE_RECRUITER_ERROR,
  CLEAR_DATA
} from './constants';
import { updateRecruiter } from 'services/api/recruiterService';

export default (recruiterId, data) => {
  return async dispatch => {
    try {
      dispatch(updateRecruiterAction());
      const response = await updateRecruiter(recruiterId, data);
      dispatch(updateRecruiterSuccess(response.data));
    } catch (err) {
      dispatch(updateRecruiterError(err.response?.data));
    }
  }
}

export const clearData = () => {
  return dispatch => {
    dispatch(clearDataAction());
  }
}

function clearDataAction() {
  return {
    type: CLEAR_DATA,
  };
}

function updateRecruiterAction() {
  return {
    type: UPDATE_RECRUITER,
  };
}

function updateRecruiterSuccess(payload) {
  return {
    type: UPDATE_RECRUITER_SUCCESS,
    payload
  };
}

function updateRecruiterError(error) {
  return {
    type: UPDATE_RECRUITER_ERROR,
    error
  };
}