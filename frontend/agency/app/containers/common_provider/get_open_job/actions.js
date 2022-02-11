/*
 *
 * RecruiterJob actions
 *
 */

import { 
  LOAD_OPEN_JOBS,
  LOAD_OPEN_JOBS_SUCCESS,
  LOAD_OPEN_JOBS_ERROR,  
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

export default data => {
  const { agencyId, params } = data;
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