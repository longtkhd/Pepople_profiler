/*
 *
 * Clientcandidatereport actions
 *
 */

import {
  getClientCandidateReportService,
  updateClientFeedbackService,
  getClientFeebackService,
  downloadDocumentService,
  createClientFeedbackService
} from 'services/api/clientJobReportSevice';
import {
  GET_CANDIDATE_REPORT,
  GET_CANDIDATE_REPORT_ERROR,
  GET_CANDIDATE_REPORT_SUCCESS,
  UPDATE_CLIENT_FEEDBACK,
  UPDATE_CLIENT_FEEDBACK_ERROR,
  UPDATE_CLIENT_FEEDBACK_SUCCESS,
  GET_CLIENT_FEEDBACK,
  GET_CLIENT_FEEDBACK_ERROR,
  GET_CLIENT_FEEDBACK_SUCCESS,
  DOWNLOAD_DOCUMENT,
  DOWNLOAD_DOCUMENT_SUCCESS,
  DOWNLOAD_DOCUMENT_ERROR,
  CLEAR_ALL,
} from './constants'

function getCandidateReport() {
  return {
    type: GET_CANDIDATE_REPORT,
  };
}

function getCandidateReportSuccess(payload) {
  return {
    type: GET_CANDIDATE_REPORT_SUCCESS,
    payload,
  };
}

function getCandidateReportError(error) {
  return {
    type: GET_CANDIDATE_REPORT_ERROR,
    error,
  };
}

function updateClientFeedback() {
  return {
    type: UPDATE_CLIENT_FEEDBACK,
  };
}

function updateClientFeedbackSuccess(payload) {
  return {
    type: UPDATE_CLIENT_FEEDBACK_SUCCESS,
    payload,
  };
}

function updateClientFeedbackError(error) {
  return {
    type: UPDATE_CLIENT_FEEDBACK_ERROR,
    error,
  };
}

function getClientFeedback() {
  return {
    type: GET_CLIENT_FEEDBACK,
  };
}

function getClientFeedbackSuccess(payload) {
  return {
    type: GET_CLIENT_FEEDBACK_SUCCESS,
    payload,
  };
}

function getClientFeedbackError(error) {
  return {
    type: GET_CLIENT_FEEDBACK_ERROR,
    error,
  };
}

function downloadDocument() {
  return {
    type: DOWNLOAD_DOCUMENT,
  };
}

function downloadDocumentSuccess(payload) {
  return {
    type: DOWNLOAD_DOCUMENT_SUCCESS,
    payload,
  };
}

function downloadDocumentError(error) {
  return {
    type: DOWNLOAD_DOCUMENT_ERROR,
    error,
  };
}

export function clearAllAction() {
  return {
    type: CLEAR_ALL,
  }
}

export function getCandidateReportAction(invite_token, candidateId) {
  return async dispatch => {
    try {
      dispatch(getCandidateReport());
      const response = await getClientCandidateReportService(
        invite_token,
        candidateId,
      );
      dispatch(getCandidateReportSuccess(response?.data));
    } catch (error) {
      dispatch(getCandidateReportError(error.response?.data));
    }
  };
}

export function getClientFeedbackAction(inviteToken, candidateId) {
  return async dispatch => {
    try {
      dispatch(getClientFeedback());
      const response = await getClientFeebackService(inviteToken, candidateId);
      dispatch(getClientFeedbackSuccess(response?.data));
    } catch (error) {
      dispatch(getClientFeedbackError(error.response?.data));
    }
  };
}

export function updateClientFeedbackAction(inviteToken, data) {
  return async dispatch => {
    try {
      dispatch(updateClientFeedback());
      const response = await updateClientFeedbackService(inviteToken, data);
      if(response?.data?.success){
        dispatch(updateClientFeedbackSuccess(response?.data));
      }else{
        dispatch(updateClientFeedbackError(response?.data?.error));
      }
    } catch (error) {
      dispatch(updateClientFeedbackError(error.response?.data));
    }
  };
}

export function createClientFeedbackAction(inviteToken, data) {
  return async dispatch => {
    try {
      dispatch(updateClientFeedback());
      const response = await createClientFeedbackService(inviteToken, data);
      if(response?.data?.success){
        dispatch(updateClientFeedbackSuccess(response?.data));
      }else{
        dispatch(updateClientFeedbackError(response?.data?.error));
      }
    } catch (error) {
      dispatch(updateClientFeedbackError(error.response?.data));
    }
  };
}

export function downloadDocumentsAction(inviteToken, doc) {
  return async dispatch => {
    try {
      dispatch(downloadDocument());
      let docId = doc?.id;
      let fileName = doc?.file_name;
      const response = await downloadDocumentService(inviteToken, docId);
      if(response?.data){
        const data = { data: response?.data, fileName: fileName };
        dispatch(downloadDocumentSuccess(data));
      }else {
        dispatch(downloadDocumentError(response?.data?.error));
      }
    } catch (error) {
      dispatch(downloadDocumentError(error));
    }
  };
}
