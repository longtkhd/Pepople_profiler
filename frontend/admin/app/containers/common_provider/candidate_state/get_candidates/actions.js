/*
 *
 * get candidates actions
 *
 */

import {
  INIT_GET_CANDIDATES,
  GET_CANDIDATE_SUCCESS,
  GET_CANDIDATE_FAIL,
  CLEAN_UP_CANDIDATE,
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const getCandidates = (agencyId,param) => async dispatch => {
  try {
    dispatch(initGetCandidates());
    const res = await candidateService.getListCandidate(agencyId,param);
    dispatch(getCandidateSuccess(res.data));
  } catch (error) {
    dispatch(getCandidateError(error));
  }
}

export const initGetCandidates = () => ({
  type: INIT_GET_CANDIDATES
});

export const getCandidateSuccess = payload => ({
  type: GET_CANDIDATE_SUCCESS,
  payload
});

export const getCandidateError = payload => ({
  type: GET_CANDIDATE_FAIL,
  payload
});

export const cleanUpCandidates = () => ({
  type: CLEAN_UP_CANDIDATE,
})
