/*
 *
 * delete candidates actions
 *
 */

import {
  INIT_DELETE_CANDIDATE,
  DELETE_CANDIDATE_SUCCESS,
  DELETE_CANDIDATE_FAIL,
  CLEAN_UP_DELETE_CANDIDATE,
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const deleteCandidateDetail = (candidateId,jobId) => async dispatch => {
  try {
    dispatch(initDeleteCandidate());
    const res = await candidateService.deleteCandidateInfoDetail(candidateId,jobId);
    dispatch(deleteCandidateSuccess(res.data));
    window.location.reload();
  } catch (error) {
    dispatch(deleteCandidateError(error));
    percentAddCandidate(0);
  }
};

export const initDeleteCandidate = () => ({
  type: INIT_DELETE_CANDIDATE,
});

export const deleteCandidateSuccess = (payload) => ({
  type: DELETE_CANDIDATE_SUCCESS,
  payload,
});

export const deleteCandidateError = (payload) => ({
  type: DELETE_CANDIDATE_FAIL,
  payload,
});

export const cleanUpDeleteCandidate = () => ({
  type: CLEAN_UP_DELETE_CANDIDATE,
});

