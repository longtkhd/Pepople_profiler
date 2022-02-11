/*
 *
 * RecruiterJob actions
 *
 */

import { 
  LOAD_CLOSED_JOBS,
  LOAD_CLOSED_JOBS_SUCCESS,
  LOAD_CLOSED_JOBS_ERROR,
} from './constants';
import { getJobs } from 'services/api/jobService';

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

export default data => {
  const { agencyId, params } = data;
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