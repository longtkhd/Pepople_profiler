/*
 *
 * get shortlisted candidates actions
 *
 */

import {
  INIT_GET_SHORTLISTED_CANDIDATES,
  GET_SHORTLISTED_CANDIDATES_SUCCESS,
  GET_SHORTLISTED_CANDIDATES_FAIL,
  CLEAN_UP_SHORTLISTED_CANDIDATES,
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const getShortlistedCandidate = (jobId,param) => async dispatch => {
  try {
    dispatch(initGetShortlistedCandidates());
    const res = await candidateService.getShortlistedCandidate(jobId,param);
    dispatch(getShortlistedCandidateSuccess(res.data));
  } catch (error) {
    dispatch(getShortlistedCandidateError(error));
  }
}

export const initGetShortlistedCandidates = () => ({
  type: INIT_GET_SHORTLISTED_CANDIDATES
});

export const getShortlistedCandidateSuccess = payload => ({
  type: GET_SHORTLISTED_CANDIDATES_SUCCESS,
  payload
});

export const getShortlistedCandidateError = payload => ({
  type: GET_SHORTLISTED_CANDIDATES_FAIL,
  payload
});

export const cleanUpShortlistedCandidate = () => ({
  type: CLEAN_UP_SHORTLISTED_CANDIDATES,
})
