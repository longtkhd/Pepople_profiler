/*
 *
 * CandidateReportDocuments actions
 *
 */

import {
  getDocumentsService,
  uploadDocumentService,
  removeDocumentService,
  dowloadDocumentService,
  updatePublicDocumentService,
  dowloadAssessmentReportService
} from 'services/api/candidateService';

import {
  GET_DOCUMENT,
  GET_DOCUMENT_SUCCESS,
  GET_DOCUMENT_ERROR,
  DOWNLOAD_DOCUMENT,
  DOWNLOAD_DOCUMENT_ERROR, DOWNLOAD_DOCUMENT_SUCCESS,
  REMOVE_DOCUMENT,
  CLEAN_STATE_DOCUMENT,
  REMOVE_DOCUMENT_ERROR,
  REMOVE_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT_ERROR,
  UPLOAD_DOCUMENT_SUCCESS,
  UPDATE_PUBLIC_DOCUMENT,
  UPDATE_PUBLIC_DOCUMENT_ERROR,
  UPDATE_PUBLIC_DOCUMENT_SUCCESS,
  DOWNLOAD_ASSESSMENT,
  DOWNLOAD_ASSESSMENT_ERROR,
  DOWNLOAD_ASSESSMENT_SUCCESS
} from './constants';

function getDocuments() {
  return {
    type: GET_DOCUMENT,
  };
}

function getDocumentsSuccess(payload) {
  return {
    type: GET_DOCUMENT_SUCCESS,
    payload,
  };
}

function getDocumentsError(error) {
  return {
    type: GET_DOCUMENT_ERROR,
    error,
  };
}

function uploadDocument() {
  return {
    type: UPLOAD_DOCUMENT,
  };
}

function uploadDocumentSuccess(payload) {
  return {
    type: UPLOAD_DOCUMENT_SUCCESS,
    payload,
  };
}

function uploadDocumentError(error) {
  return {
    type: UPLOAD_DOCUMENT_ERROR,
    error,
  };
}

function removeDocument() {
  return {
    type: REMOVE_DOCUMENT,
  };
}

function removeDocumentSuccess(payload) {
  return {
    type: REMOVE_DOCUMENT_SUCCESS,
    payload,
  };
}

function removeDocumentError(error) {
  return {
    type: REMOVE_DOCUMENT_ERROR,
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

function updatePublicDocument() {
  return {
    type: UPDATE_PUBLIC_DOCUMENT,
  };
}

function updatePublicDocumentSuccess(payload) {
  return {
    type: UPDATE_PUBLIC_DOCUMENT_SUCCESS,
    payload,
  };
}

function updatePublicDocumentError(error) {
  return {
    type: UPDATE_PUBLIC_DOCUMENT_ERROR,
    error,
  };
}

function downloadAssessmentReport() {
  return {
    type: DOWNLOAD_ASSESSMENT,
  };
}

function downloadAssessmentReportSuccess(payload) {
  return {
    type: DOWNLOAD_ASSESSMENT_SUCCESS,
    payload,
  };
}

function downloadAssessmentReportError(error) {
  return {
    type: DOWNLOAD_ASSESSMENT_ERROR,
    error,
  };
}

export function cleanAllStateDocument() {
  return {
    type: CLEAN_STATE_DOCUMENT,
  }
}

export function getDocumentsAction(candidateId, params) {
  return async dispatch => {
    try {
      dispatch(getDocuments());
      const response = await getDocumentsService(candidateId, params);
      if (response?.data?.success) {
        dispatch(getDocumentsSuccess(response?.data));
      } else {
        dispatch(getDocumentsError(response?.error));
      }
    } catch (error) {
      dispatch(getDocumentsError(error?.data?.message));
    }
  };
}

export function uploadDocumentAction(candidateId, file) {
  return async dispatch => {
    try {
      dispatch(uploadDocument());
      const response = await uploadDocumentService(candidateId, file);
      if (response?.data?.success) {
        dispatch(uploadDocumentSuccess(response?.data));
      } else {
        dispatch(uploadDocumentError(response?.error));
      }
    } catch (error) {
      dispatch(uploadDocumentError(error?.data?.message));
    }
  };
}

export function removeDocumentsAction(candidateId, docId) {
  return async dispatch => {
    try {
      dispatch(removeDocument());
      const response = await removeDocumentService(candidateId, docId);
      if (response?.data?.success) {
        dispatch(removeDocumentSuccess(response?.data));
      } else {
        dispatch(removeDocumentError(response?.error));
      }
    } catch (error) {
      dispatch(removeDocumentError(error?.data?.message));
    }
  };
}

export function downloadDocumentsAction(candidateId, doc) {
  return async dispatch => {
    try {
      dispatch(downloadDocument());
      const fileName = doc?.file_name;
      const docId = doc?.id;
      const response = await dowloadDocumentService(candidateId, docId);
      if (response?.data) {
        const data = { data: response?.data, fileName: fileName };
        dispatch(downloadDocumentSuccess(data));
      } else {
        dispatch(downloadDocumentError(response?.error));
      }
    } catch (error) {
      dispatch(downloadDocumentError(error?.data?.message));
    }
  };
}

export function updatePublicDocumentsAction(candidateId, docIds) {
  return async dispatch => {
    try {
      dispatch(updatePublicDocument());
      const response = await updatePublicDocumentService(candidateId, docIds);
      if (response?.data?.success) {
        dispatch(updatePublicDocumentSuccess(response?.data));
      } else {
        dispatch(updatePublicDocumentError(response?.error));
      }
    } catch (error) {
      dispatch(updatePublicDocumentError(error?.data?.message));
    }
  };
}

export function downloadAssessmentReportAction(assessmentId) {
  return async dispatch => {
    try {
      dispatch(downloadAssessmentReport());
      const response = await dowloadAssessmentReportService(assessmentId);
      if (response?.data) {
        const fileName = `assessment-report${assessmentId}.zip`;
        const data = { fileName: fileName, data: response?.data}
        dispatch(downloadAssessmentReportSuccess(data));
      } else {
        dispatch(downloadAssessmentReportError(response?.error));
      }
    } catch (error) {
      dispatch(downloadAssessmentReportError(error?.data?.message));
    }
  };
}
