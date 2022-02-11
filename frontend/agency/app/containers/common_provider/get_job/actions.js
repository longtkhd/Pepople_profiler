/*
 *
 * RecruiterJob actions
 *
 */

import {
  LOAD_JOBS,
  LOAD_JOBS_SUCCESS,
  LOAD_JOBS_ERROR,
} from './constants';
import { getJobs } from 'services/api/jobService';

function loadJobsAction() {
  return {
    type: LOAD_JOBS,
  };
}

function loadJobsSuccess(response) {
  return {
    type: LOAD_JOBS_SUCCESS,
    response
  };
}

function loadJobsError(error) {
  return {
    type: LOAD_JOBS_ERROR,
    error
  };
}

export const loadJobs = data => {
  const { agencyId, params } = data
  return async dispatch => {
    try {
      dispatch(loadJobsAction());
      const response = await getJobs(agencyId, params);
      dispatch(loadJobsSuccess(response.data));
    } catch (err) {
      dispatch(loadJobsError(err.response?.data));
    }
  }
}
