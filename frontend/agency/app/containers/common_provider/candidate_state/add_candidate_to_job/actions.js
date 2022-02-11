/*
 *
 * get candidates actions
 *
 */

import {
  ADD_EXISTING_CANDIDATE,
  DELETE_EXISTING_CANDIDATE,
  INIT_ADD_EXISTING_CANDIDATE,
  ADD_EXISTING_CANDIDATE_SUCCESS,
  ADD_EXISTING_CANDIDATE_FAIL,
  CLEAN_UP_ADD_EXISTING,
  PERCENT_UPLOAD_ADD_EXISTING,
  SHOW_MODAL_ADD_CANDIDATE_TO_JOB,
  CLOSE_MODAL_ADD_CANDIDATE_TO_JOB,
  INIT_ADD_CANDIDATE_TO_JOB_REQUEST,
  ADD_CANDIDATE_TO_JOB_SUCCESS,
  CLEAR_STATUS_ADD_CANDIDATE_TO_JOB_REQUEST,
  ADD_CANDIDATE_TO_JOB_ERROR

} from './constants';
import * as candidateService from 'services/api/candidateService';

export const addCandidateToJobRequest = (candidateId, list) => async dispatch => {   
  try {
    dispatch(initAddCandidateToJobRequest());
    const res = await candidateService.addCandidateToJobService(candidateId, list);
    if(res?.data?.success){
      dispatch(addCandidateToJobSuccess());
    }
    
  } catch (error) {
    dispatch(addCandidateToJobError(error));
  }
};
export const clearStatusAddCandidateToJob = () => dispatch => {   
    dispatch(clearStatusAddCandidateToJobRequest());
};

const initAddCandidateToJobRequest = () => ({
  type: INIT_ADD_CANDIDATE_TO_JOB_REQUEST,
});
const clearStatusAddCandidateToJobRequest = () => ({
  type: CLEAR_STATUS_ADD_CANDIDATE_TO_JOB_REQUEST,
});

const addCandidateToJobSuccess = () => ({
  type: ADD_CANDIDATE_TO_JOB_SUCCESS,
});
const addCandidateToJobError = () => ({
  type: ADD_CANDIDATE_TO_JOB_ERROR,
});

// export const addExistCandidateError = (payload) => ({
//   type: ADD_EXISTING_CANDIDATE_FAIL,
//   payload,
// });

// export const cleanUpAddExistCandidate = () => ({
//   type: CLEAN_UP_ADD_EXISTING,
// });

// export const addCandidateToList = (payload) => ({
//   type: ADD_EXISTING_CANDIDATE,
//   payload,
// });

// export const deleteExistCandidate = (id) => ({
//   type: DELETE_EXISTING_CANDIDATE,
//   payload: { id },
// });

// export const percentAddCandidate = payload => ({
//   type: PERCENT_UPLOAD_ADD_EXISTING,
//   payload,
// })

export const showModalRequest = () => dispatch => {
  dispatch(showModalAddCandidateToJob())
}

const showModalAddCandidateToJob  = () => ({
  type: SHOW_MODAL_ADD_CANDIDATE_TO_JOB,
})
export const closeModalRequest = () => dispatch => {
  dispatch(closeModalAddCandidateToJob())
}

const closeModalAddCandidateToJob  = () => ({
  type: CLOSE_MODAL_ADD_CANDIDATE_TO_JOB,
})
