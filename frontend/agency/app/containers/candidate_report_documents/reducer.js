/*
 *
 * CandidateReportDocuments reducer
 *
 */
import produce from 'immer';
import {
  DOWNLOAD_DOCUMENT,
  DOWNLOAD_DOCUMENT_ERROR,
  DOWNLOAD_DOCUMENT_SUCCESS,
  GET_DOCUMENTS,
  GET_DOCUMENTS_ERROR,
  GET_DOCUMENTS_SUCCESS,
  REMOVE_DOCUMENTS,
  REMOVE_DOCUMENTS_ERROR,
  REMOVE_DOCUMENTS_SUCCESS,
  UPDATE_PUBLIC_DOCUMENT,
  UPDATE_PUBLIC_DOCUMENT_ERROR,
  UPDATE_PUBLIC_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENTS,
  UPLOAD_DOCUMENTS_ERROR,
  UPLOAD_DOCUMENTS_SUCCESS,
  CLEAR_DOWNLOAD_DOCUMENT
} from './constants';

export const initialState = {
  loading: false,
  documents: null,
  error: null,
  uploaded: null,
  removed: null,
  download: null,
  updated: false,
  errorDownload: null,
  loadingDownLoad: false,
};

/* eslint-disable default-case, no-param-reassign */
const candidateReportDocumentsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_DOCUMENTS:
        draft.loading = true;
        draft.documents = null;
        draft.removed = null;
        draft.uploaded = null;
        draft.download = null;
        draft.updated = false;
        draft.error = null;
        break;
      case GET_DOCUMENTS_SUCCESS:
        draft.loading = false;
        draft.documents = action.payload.data;
        draft.error = null;
        break;
      case GET_DOCUMENTS_ERROR:
        draft.loading = false;
        draft.documents = null;
        draft.error = action.error || 'Get document faild!';
        break;
      case UPLOAD_DOCUMENTS:
        draft.loading = true;
        draft.uploaded = null;
        draft.error = null;
        break;
      case UPLOAD_DOCUMENTS_SUCCESS:
        draft.loading = false;
        draft.uploaded = action.payload.data;
        draft.error = null;
        break;
      case UPLOAD_DOCUMENTS_ERROR:
        draft.loading = false;
        draft.uploaded = null;
        draft.error = action.error || 'Upload document faild!';
        break;
      case REMOVE_DOCUMENTS:
        draft.loading = true;
        draft.removed = null;
        draft.error = null;
        break;
      case REMOVE_DOCUMENTS_SUCCESS:
        draft.loading = false;
        draft.removed = action.payload.data;
        draft.error = null;
        break;
      case REMOVE_DOCUMENTS_ERROR:
        draft.loading = false;
        draft.removed = null;
        draft.error = action.error || 'Remove document faild!';
        break;
      case DOWNLOAD_DOCUMENT:
        draft.loadingDownLoad = true;
        draft.download = null;
        draft.errorDownload = action.error;
        break;
      case DOWNLOAD_DOCUMENT_SUCCESS:
        draft.loadingDownLoad = false;
        draft.download = action.payload;
        draft.errorDownload = null;
        break;
      case DOWNLOAD_DOCUMENT_ERROR:
        draft.loadingDownLoad = false;
        draft.download = null;
        draft.errorDownload = action.error || 'Download document faild!';
        break;
      case CLEAR_DOWNLOAD_DOCUMENT:
        draft.loadingDownLoad = false;
        draft.download = null;
        draft.errorDownload = null;
        break;
      case UPDATE_PUBLIC_DOCUMENT:
        draft.loading = true;
        draft.updated = false;
        draft.error = null;
        break;
      case UPDATE_PUBLIC_DOCUMENT_SUCCESS:
        draft.loading = false;
        draft.updated = action.payload.data;
        draft.error = null;
        break;
      case UPDATE_PUBLIC_DOCUMENT_ERROR:
        draft.loading = false;
        draft.updated = false;
        draft.error = action.error || 'Share document faild!';
        break;
    }
  });

export default candidateReportDocumentsReducer;
