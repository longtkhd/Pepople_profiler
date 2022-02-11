/*
 *
 * OpenJob actions
 *
 */

import { 
  ASSIGN_RECRUITER,
  ASSIGN_RECRUITER_SUCCESS,
  ASSIGN_RECRUITER_ERROR,
} from './constants';
import { assignRecruiter } from 'services/api/jobService';

export default data => {
  return async dispatch => {
    try {
      dispatch(assignRecruiterToJob());
      const response = await assignRecruiter(data);
      dispatch(assignRecruiterSuccess(response.data));
    } catch (err) {
      dispatch(assignRecruiterError(err.response?.data));
    }
  }
}

function assignRecruiterToJob() {
  return {
    type: ASSIGN_RECRUITER,
  };
}

function assignRecruiterSuccess(response) {
  return {
    type: ASSIGN_RECRUITER_SUCCESS,
    response
  };
}

function assignRecruiterError(error) {
  return {
    type: ASSIGN_RECRUITER_ERROR,
    error
  };
}
