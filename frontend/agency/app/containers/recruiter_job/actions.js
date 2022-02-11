/*
 *
 * RecruiterJob actions
 *
 */

import { 
  LOAD_OPEN_JOBS,
  LOAD_OPEN_JOBS_SUCCESS,
  LOAD_OPEN_JOBS_ERROR,  
  LOAD_CLOSED_JOBS,
  LOAD_CLOSED_JOBS_SUCCESS,
  LOAD_CLOSED_JOBS_ERROR,
} from './constants';
import { getJobs } from 'services/api/jobService';

function loadOpenJobsAction() {
  return {
    type: LOAD_OPEN_JOBS,
  };
}

function loadOpenJobsSuccess(response) {
  return {
    type: LOAD_OPEN_JOBS_SUCCESS,
    response
  };
}

function loadOpenJobsError(error) {
  return {
    type: LOAD_OPEN_JOBS_ERROR,
    error
  };
}

function loadClosedJobsAction() {
  return {
    type: LOAD_CLOSED_JOBS,
  };
}

function loadClosedJobsSuccess(response) {
  return {
    type: LOAD_CLOSED_JOBS_SUCCESS,
    response
  };
}

function loadClosedJobsError(error) {
  return {
    type: LOAD_CLOSED_JOBS_ERROR,
    error
  };
}

export const loadOpenJobs = data => {
  const { agencyId, params } = data
  return async dispatch => {
    try {
      dispatch(loadOpenJobsAction());
      const response = await getJobs(agencyId, params);
      dispatch(loadOpenJobsSuccess(response.data));
    } catch (err) {
      dispatch(loadOpenJobsError(err.response?.data));
    }
  }
}

export const loadClosedJobs = data => {
  const { agencyId, params } = data
  return async dispatch => {
    try {
      dispatch(loadClosedJobsAction());
      const response = await getJobs(agencyId, params);
      dispatch(loadClosedJobsSuccess(response.data));
    } catch (err) {
      dispatch(loadClosedJobsError(err.response?.data));
    }
  }
}