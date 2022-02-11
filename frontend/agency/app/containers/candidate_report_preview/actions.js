/*
 *
 * CandidateReportPreview actions
 *
 */

import {
  GET_CANDIDATE_INFO,
  GET_CANDIDATE_INFO_ERROR,
  GET_CANDIDATE_INFO_SUCCESS,
} from './constants';
import { getCandidateInfoService } from 'services/api/candidateService';

function getCandidateInfo() {
  return {
    type: GET_CANDIDATE_INFO,
  };
}

function getCandidateInfoSuccess(payload) {
  return {
    type: GET_CANDIDATE_INFO_SUCCESS,
    payload,
  };
}

function getCandidateInfoError(error) {
  return {
    type: GET_CANDIDATE_INFO_ERROR,
    error,
  };
}

export function getCandidateInfoAction(candidateId) {
  return async dispatch => {
    try {
      dispatch(getCandidateInfo());
      const response = await getCandidateInfoService(candidateId);
      dispatch(getCandidateInfoSuccess(response?.data));
    } catch (error) {
      dispatch(getCandidateInfoError(error.response?.data));
    }
  };
}
