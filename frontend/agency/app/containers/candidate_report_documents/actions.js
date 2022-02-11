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
  updatePublicDocumentService
} from 'services/api/candidateService';


import {
  GET_DOCUMENTS,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_ERROR,
  UPLOAD_DOCUMENTS,
  UPLOAD_DOCUMENTS_ERROR,
  UPLOAD_DOCUMENTS_SUCCESS,
  REMOVE_DOCUMENTS,
  REMOVE_DOCUMENTS_SUCCESS,
  REMOVE_DOCUMENTS_ERROR,
  DOWNLOAD_DOCUMENT,
  DOWNLOAD_DOCUMENT_SUCCESS,
  DOWNLOAD_DOCUMENT_ERROR,
  UPDATE_PUBLIC_DOCUMENT,
  UPDATE_PUBLIC_DOCUMENT_SUCCESS,
  UPDATE_PUBLIC_DOCUMENT_ERROR,
  CLEAR_DOWNLOAD_DOCUMENT
} from './constants';

function getDocuments() {
  return {
    type: GET_DOCUMENTS,
  };
}

function getDocumentsSuccess(payload) {
  return {
    type: GET_DOCUMENTS_SUCCESS,
    payload,
  };
}

function getDocumentsError(error) {
  return {
    type: GET_DOCUMENTS_ERROR,
    error,
  };
}

function uploadDocument() {
  return {
    type: UPLOAD_DOCUMENTS,
  };
}

function uploadDocumentSuccess(payload) {
  return {
    type: UPLOAD_DOCUMENTS_SUCCESS,
    payload,
  };
}

function uploadDocumentError(error) {
  return {
    type: UPLOAD_DOCUMENTS_ERROR,
    error,
  };
}

function removeDocument() {
  return {
    type: REMOVE_DOCUMENTS,
  };
}

function removeDocumentSuccess(payload) {
  return {
    type: REMOVE_DOCUMENTS_SUCCESS,
    payload,
  };
}

function removeDocumentError(error) {
  return {
    type: REMOVE_DOCUMENTS_ERROR,
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

export function clearDownloadDocumentAction() {
  return {
    type: CLEAR_DOWNLOAD_DOCUMENT,
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
