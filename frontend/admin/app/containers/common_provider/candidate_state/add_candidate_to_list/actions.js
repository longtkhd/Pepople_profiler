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
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const addExistCandidate = (jobId,payload,param) => async dispatch => {
  try {
    dispatch(initAddExistCandidate());
    const res = await candidateService.addExistingCandidates(jobId,payload,param);
    dispatch(addExistCandidateSuccess(res.data));
  } catch (error) {
    dispatch(addExistCandidateError(error));
    percentAddCandidate(0);
  }
};

export const initAddExistCandidate = () => ({
  type: INIT_ADD_EXISTING_CANDIDATE,
});

export const addExistCandidateSuccess = (payload) => ({
  type: ADD_EXISTING_CANDIDATE_SUCCESS,
  payload,
});

export const addExistCandidateError = (payload) => ({
  type: ADD_EXISTING_CANDIDATE_FAIL,
  payload,
});

export const cleanUpAddExistCandidate = () => ({
  type: CLEAN_UP_ADD_EXISTING,
});

export const addCandidateToList = (payload) => ({
  type: ADD_EXISTING_CANDIDATE,
  payload,
});

export const deleteExistCandidate = (id) => ({
  type: DELETE_EXISTING_CANDIDATE,
  payload: { id },
});

export const percentAddCandidate = payload => ({
  type: PERCENT_UPLOAD_ADD_EXISTING,
  payload,
})
