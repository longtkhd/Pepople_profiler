/*
 *
 * Get recruiter list actions
 *
 */

import {
  GET_RECRUITER_LIST,
  GET_RECRUITER_LIST_SUCCESS,
  GET_RECRUITER_LIST_ERROR,
  GET_RECRUITER_LIST_BY_ADMIN_SUCCESS,
  GET_RECRUITER_LIST_BY_ADMIN,
  GET_RECRUITER_LIST_BY_ADMIN_ERROR,

} from './constants';
import { getRecruiters } from 'services/api/agencyService';
import { getRecruiterListByAdmin } from 'services/api/recruiterService'

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

export default (agencyId,params) => {
  return async dispatch => {
    try {
      dispatch(getRecruiterList());
      const response = await getRecruiters(agencyId,params);
      dispatch(getRecruiterListSuccess(response.data));
    } catch (err) {
      dispatch(getRecruiterListError(err.response?.data));
    }
  }
}

export const getRecruiterByAdmin = (params) => {
  return async dispatch => {
    try {
      dispatch(getRecruiterByAdminAction());
      const response = await getRecruiterListByAdmin(params);
      dispatch(getRecruiterByAdminSuccess(response.data))
    } catch (e) {
      dispatch(getRecruiterByAdminError(e?.response?.data))

    }
  }

}

function getRecruiterByAdminAction(payload) {
  return {
    type: GET_RECRUITER_LIST_BY_ADMIN,
    payload
  }
}
function getRecruiterByAdminSuccess(payload) {
  return {
    type: GET_RECRUITER_LIST_BY_ADMIN_SUCCESS,
    payload
  }
}

function getRecruiterByAdminError(payload) {
  return {
    type: GET_RECRUITER_LIST_BY_ADMIN_ERROR,
    payload
  }
}

