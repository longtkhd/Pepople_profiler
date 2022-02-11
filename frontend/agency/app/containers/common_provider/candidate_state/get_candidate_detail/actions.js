/*
 *
 * get candidate detail actions
 *
 */

import {
  INIT_GET_CANDIDATE_DETAIL,
  GET_CANDIDATE_DETAIL_SUCCESS,
  GET_CANDIDATE_DETAIL_FAIL,
  CLEAN_UP_CANDIDATE_DETAIL,
} from './constants';
import * as candidateService from 'services/api/candidateService';

export const getCandidateDetail = (candidateId, param) => async dispatch => {
  try {
    dispatch(initGetCandidateDetail());
    const res = await candidateService.getCandidateInfoService(
      candidateId,
      param,
    );
    dispatch(getCandidateDetailSuccess(res.data));
  } catch (error) {
    dispatch(getCandidateDetailError(error));
  }
};

export const initGetCandidateDetail = () => ({
  type: INIT_GET_CANDIDATE_DETAIL,
});

export const getCandidateDetailSuccess = payload => ({
  type: GET_CANDIDATE_DETAIL_SUCCESS,
  payload,
});

export const getCandidateDetailError = payload => ({
  type: GET_CANDIDATE_DETAIL_FAIL,
  payload,
});

export const cleanUpCandidateDetail = () => ({
  type: CLEAN_UP_CANDIDATE_DETAIL,
});
