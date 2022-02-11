/*
 *
 * finish-assessments actions
 *
 */

import {
  HANDLE_CANDIDATE_ASSESSMENT,
  HANDLE_CANDIDATE_ASSESSMENT_ERROR,
  HANDLE_CANDIDATE_ASSESSMENT_SUCCESS,
} from './constants';
import { handleCandidateAssessmentService } from 'services/api/candidateService';

function handleCandidateAssessment() {
  return {
    type: HANDLE_CANDIDATE_ASSESSMENT,
  };
}

function handleCandidateAssessmentSuccess(payload) {
  return {
    type: HANDLE_CANDIDATE_ASSESSMENT_SUCCESS,
    payload,
  };
}

function handleCandidateAssessmentError(error) {
  return {
    type: HANDLE_CANDIDATE_ASSESSMENT_ERROR,
    error,
  };
}

export function handleCandidateAssessmentAction(params) {
  return async dispatch => {
    try {
      dispatch(handleCandidateAssessment());

      const response = await handleCandidateAssessmentService(params);
      // console.log('response', response);
      // dispatch(handleCandidateAssessmentSuccess(response?.data));
    } catch (error) {
      console.log('error.response?.data', error.response?.data);
    }
  };
}
