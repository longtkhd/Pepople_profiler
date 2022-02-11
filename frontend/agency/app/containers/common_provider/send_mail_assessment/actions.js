/*
 *
 * SendMailAssessment actions
 *
 */

import {
  SEND_INVITE_ASSESSMENT,
  SEND_INVITE_ASSESSMENT_SUCCESS,
  SEND_INVITE_ASSESSMENT_ERROR,
  RESET_STATE
} from './constants';
 import {
  sendInviteAssessmentService,
} from 'services/api/candidateService';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

function sendInviteCandidateAssessment() {
  return {
    type: SEND_INVITE_ASSESSMENT,
  };
}

function sendInviteCandidateAssessmentSuccess(payload) {
  return {
    type: SEND_INVITE_ASSESSMENT_SUCCESS,
    payload,
  };
}

function sendInviteCandidateAssessmentError(error) {
  return {
    type: SEND_INVITE_ASSESSMENT_ERROR,
    error,
  };
}

function resetState() {
  return {
    type: RESET_STATE
  }
}

export function sendInviteCandidateAssessmentAction(candidateId, data) {
  return async dispatch => {
    try {
      dispatch(sendInviteCandidateAssessment());
      const res = await sendInviteAssessmentService(candidateId, data);
      if(res?.data?.success){
        dispatch(sendInviteCandidateAssessmentSuccess(res?.data));
        dispatch(resetState());
      }else{
        dispatch(sendInviteCandidateAssessmentError(res?.data?.error));
        dispatch(resetState());
      }
    } catch (error) {
      dispatch(sendInviteCandidateAssessmentError(error));
    }
  };
}

