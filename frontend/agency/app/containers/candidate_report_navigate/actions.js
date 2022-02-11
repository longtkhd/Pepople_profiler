import {
  ADD_CANDIDATE_TO_JOB,
  ADD_CANDIDATE_TO_JOB_SUCCESS,
  ADD_CANDIDATE_TO_JOB_ERROR,
  SET_STATUS_TO_FALSE,
  ADD_CANDIDATE_TO_JOB_THAT_UNSELECTED
} from './constants';
import { addCandidateToJobService } from 'services/api/candidateService';
import { getJobListExcludeCandidateId } from 'components/AddCandidateIntoJobTable/actions';

export const addCandidateToJobRequest = () => {
  return {
    type: ADD_CANDIDATE_TO_JOB,
  };
};

export const addCandidateToJobThatUnSelectedRequest = () => {
  return {
     type: ADD_CANDIDATE_TO_JOB_THAT_UNSELECTED
  };
};


export const addCandidateToJobThatUnSelected = () => {
  return dispatch => {
    dispatch(addCandidateToJobThatUnSelectedRequest())
    
  };
};

export const addCandidateToJobSuccess = response => {
  return {
    type: ADD_CANDIDATE_TO_JOB_SUCCESS,
    response,
  };
};


export const addCandidateToJobError = error => {
  return {
    type: ADD_CANDIDATE_TO_JOB_ERROR,
    error,
  };
};
export const setStatusFalse = () => {
  return {
    type: SET_STATUS_TO_FALSE,
    
  };
};
export const setStatusAddFalse = () => {
  return dispatch => {
    dispatch(setStatusFalse());
  };
};

export const addCandidateToJob = (candidateId, listKey) => {
  const data = {
    job_id_list: listKey,
  };
  return async dispatch => {
    try {
      dispatch(addCandidateToJobRequest());
      const response = await addCandidateToJobService(candidateId, data);

      if (response.data?.success) {
        dispatch(addCandidateToJobSuccess());
      }
    } catch (err) {
      dispatch(addCandidateToJobError(err.response?.data));
    }
  };
};
