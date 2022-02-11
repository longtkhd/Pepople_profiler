/*
 *
 * CandidateReportForm actions
 *
 */

import {
  getAssessmentIndustryService,
  getAssessmentTypeService,
  getProjectAssessmentService,
} from 'services/api/commonService';

import {
  sendInviteAssessmentService,
} from 'services/api/candidateService';
import {
  GET_ASSESSMENT_INDUSTRY,
  GET_ASSESSMENT_INDUSTRY_SUCCESS,
  GET_ASSESSMENT_INDUSTRY_ERROR,
  GET_ASSESSMENT_TYPE_ERROR,
  GET_ASSESSMENT_TYPE,
  GET_ASSESSMENT_TYPE_SUCCESS,
  GET_PROJECT_ASSESSMENT,
  GET_PROJECT_ASSESSMENT_ERROR,
  GET_PROJECT_ASSESSMENT_SUCCESS,
  CLEAR_PROJECT_ASSESSMENT,
  SEND_INVITE_ASSESSMENT,
  SEND_INVITE_ASSESSMENT_SUCCESS,
  SEND_INVITE_ASSESSMENT_ERROR,
  CLEAR_INVITE_ASSESSMENT,
  GET_ORIGINAL,
  GET_ORIGINAL_SUCCESS,
  GET_ORIGINAL_ERROR,
  UPLOAD_ORIGINAL,
  UPLOAD_ORIGINAL_SUCCESS,
  UPLOAD_ORIGINAL_ERROR,
  CLEAN_ORIGINAL,
  RESEND_INVITE_ASSESSMENT,
  RESEND_INVITE_ASSESSMENT_SUCCESS,
  RESEND_INVITE_ASSESSMENT_ERROR,
} from './constants'
import {
  getOriginalDocumentService,
  reSendAssessmentService,
  uploadOriginalDocumentService,
} from '../../services/api/candidateService'

function getAssessmentIndustry() {
  return {
    type: GET_ASSESSMENT_INDUSTRY,
  };
}

function getAssessmentIndustrySuccess(payload) {
  return {
    type: GET_ASSESSMENT_INDUSTRY_SUCCESS,
    payload,
  };
}

function getAssessmentIndustryError(error) {
  return {
    type: GET_ASSESSMENT_INDUSTRY_ERROR,
    error,
  };
}

function getAssessmentType() {
  return {
    type: GET_ASSESSMENT_TYPE,
  };
}

function getAssessmentTypeSuccess(payload) {
  return {
    type: GET_ASSESSMENT_TYPE_SUCCESS,
    payload,
  };
}

function getAssessmentTypeError(error) {
  return {
    type: GET_ASSESSMENT_TYPE_ERROR,
    error,
  };
}

function getProjectAssessment() {
  return {
    type: GET_PROJECT_ASSESSMENT,
  };
}

function getProjectAssessmentSuccess(payload) {
  return {
    type: GET_PROJECT_ASSESSMENT_SUCCESS,
    payload,
  };
}

function getProjectAssessmentError(error) {
  return {
    type: GET_PROJECT_ASSESSMENT_ERROR,
    error,
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

function reSendInviteCandidateAssessment() {
  return {
    type: RESEND_INVITE_ASSESSMENT,
  };
}

function reSendInviteCandidateAssessmentSuccess(payload) {
  return {
    type: RESEND_INVITE_ASSESSMENT_SUCCESS,
    payload,
  };
}

function reSendInviteCandidateAssessmentError(error) {
  return {
    type: RESEND_INVITE_ASSESSMENT_ERROR,
    error,
  };
}

function getOriginal() {
  return {
    type: GET_ORIGINAL,
  };
}

function getOriginalSuccess(payload) {
  return {
    type: GET_ORIGINAL_SUCCESS,
    payload,
  };
}

function getOriginalError(error) {
  return {
    type: GET_ORIGINAL_ERROR,
    error,
  };
}

function uploadOriginal() {
  return {
    type: UPLOAD_ORIGINAL,
  };
}

function uploadOriginalSuccess(payload) {
  return {
    type: UPLOAD_ORIGINAL_SUCCESS,
    payload,
  };
}

function uploadOriginalError(error) {
  return {
    type: UPLOAD_ORIGINAL_ERROR,
    error,
  };
}

export function clearProjectAssessmentAction() {
  return {
    type: CLEAR_PROJECT_ASSESSMENT,
  };
}

export function clearInvitedAssessmentAction() {
  return {
    type: CLEAR_INVITE_ASSESSMENT,
  };
}

export function clearOriginalAction() {
  return {
    type: CLEAN_ORIGINAL,
  };
}

export function getAssessmentIndustryAction() {
  return async dispatch => {
    try {
      dispatch(getAssessmentIndustry());
      const res = await getAssessmentIndustryService();
      dispatch(getAssessmentIndustrySuccess(res?.data));
    } catch (error) {
      dispatch(getAssessmentIndustryError(error));
    }
  };
}

export function getAssessmentTypeAction() {
  return async dispatch => {
    try {
      dispatch(getAssessmentType());
      const res = await getAssessmentTypeService();
      dispatch(getAssessmentTypeSuccess(res?.data));
    } catch (error) {
      dispatch(getAssessmentTypeError(error));
    }
  };
}

export function getProjectAssessmentAction(industryId, typeId) {
  return async dispatch => {
    try {
      dispatch(getProjectAssessment());
      const res = await getProjectAssessmentService(industryId, typeId);
      dispatch(getProjectAssessmentSuccess(res?.data));
    } catch (error) {
      dispatch(getProjectAssessmentError(error));
    }
  };
}

export function sendInviteCandidateAssessmentAction(candidateId, data) {
  return async dispatch => {
    try {
      dispatch(sendInviteCandidateAssessment());
      const res = await sendInviteAssessmentService(candidateId, data);
      if(res?.data?.success){
        dispatch(sendInviteCandidateAssessmentSuccess(res?.data));
      }else{
        dispatch(sendInviteCandidateAssessmentError(res?.data?.error));
      }
    } catch (error) {
      dispatch(sendInviteCandidateAssessmentError(error));
    }
  };
}

export function reSendAssessmentAction(assessmentId) {
  return async dispatch => {
    try {
      dispatch(reSendInviteCandidateAssessment());
      const res = await reSendAssessmentService(assessmentId);
      dispatch(reSendInviteCandidateAssessmentSuccess(true));
    } catch (error) {
      dispatch(reSendInviteCandidateAssessmentError(error));
    }
  };
}

export function getOriginalAction(candidateId) {
  return async dispatch => {
    try {
      dispatch(getOriginal());
      const res = await getOriginalDocumentService(candidateId);
      if(res?.data?.success){
        dispatch(getOriginalSuccess(res?.data));
      }else{
        dispatch(getOriginalError(res?.data?.error));
      }
    } catch (error) {
      dispatch(getOriginalError(error));
    }
  };
}

export function onUploadOriginalAction(candidateId, data) {
  return async dispatch => {
    try {
      dispatch(uploadOriginal());
      const res = await uploadOriginalDocumentService(candidateId, data);
      if(res?.data?.success){
        dispatch(uploadOriginalSuccess(res?.data));
      }else{
        dispatch(uploadOriginalError(res?.data?.error));
      }
      dispatch(clearOriginalAction())
    } catch (error) {
      dispatch(uploadOriginalError(error));
      dispatch(clearOriginalAction())
    }
  };
}
