/*
 *
 * RecruiterJob actions
 *
 */

import {
  CHANGE_JOB_STATUS,
  CHANGE_JOB_STATUS_SUCCESS,
  CHANGE_JOB_STATUS_ERROR,
} from './constants';
import { changeJobStatus } from 'services/api/jobService';

function changeJobStatusAction() {
  return {
    type: CHANGE_JOB_STATUS,
  };
}

function changeJobStatusSuccess(response) {
  return {
    type: CHANGE_JOB_STATUS_SUCCESS,
    response
  };
}

function changeJobStatusError(error) {
  return {
    type: CHANGE_JOB_STATUS_ERROR,
    error
  };
}

export default (agencyId, params) => {
  return async dispatch => {
    try {
      dispatch(changeJobStatusAction());
      const response = await changeJobStatus(agencyId, params);
      dispatch(changeJobStatusSuccess(response.data));
    } catch (err) {
      dispatch(changeJobStatusError(err.response?.data));
    }
  }
}
