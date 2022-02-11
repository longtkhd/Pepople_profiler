/*
 *
 * Get user info actions
 *
 */

import { 
  GET_RECRUITER_DETAILS,
  GET_RECRUITER_DETAILS_SUCCESS,
  GET_RECRUITER_DETAILS_ERROR,
} from './constants';
import { getRecruiterDetails } from 'services/api/recruiterService';

function getRecruiterDetailsAction() {
  return {
    type: GET_RECRUITER_DETAILS,
  };
}

function getRecruiterDetailsSuccess(response) {
  return {
    type: GET_RECRUITER_DETAILS_SUCCESS,
    response
  };
}

function getRecruiterDetailsError(error) {
  return {
    type: GET_RECRUITER_DETAILS_ERROR,
    error
  };
}

export default (recruiterId) => {
  return async dispatch => {
    try {
      dispatch(getRecruiterDetailsAction());
      const response = await getRecruiterDetails(recruiterId);
      dispatch(getRecruiterDetailsSuccess(response.data));
    } catch (err) {
      dispatch(getRecruiterDetailsError(err.response?.data));
    }
  }
}