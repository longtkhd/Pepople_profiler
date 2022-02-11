/*
 *
 * Get recruiter list actions
 *
 */

import { 
  GET_RECRUITER_LIST,
  GET_RECRUITER_LIST_SUCCESS,
  GET_RECRUITER_LIST_ERROR,
} from './constants';
import { getRecruiters } from 'services/api/agencyService';

function getRecruiterList() {
  return {
    type: GET_RECRUITER_LIST,
  };
}

function getRecruiterListSuccess(response) {
  return {
    type: GET_RECRUITER_LIST_SUCCESS,
    response
  };
}

function getRecruiterListError(error) {
  return {
    type: GET_RECRUITER_LIST_ERROR,
    error
  };
}

export default (agencyId, params) => {
  return async dispatch => {
    try {
      dispatch(getRecruiterList());
      const response = await getRecruiters(agencyId, params);
      dispatch(getRecruiterListSuccess(response?.data));
    } catch (err) {
      dispatch(getRecruiterListError(err.response?.data));
    }
  }
}