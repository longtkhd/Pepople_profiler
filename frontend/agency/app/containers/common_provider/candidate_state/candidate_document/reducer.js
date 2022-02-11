
import produce from 'immer';
import {
  DOWNLOAD_DOCUMENT,
  DOWNLOAD_DOCUMENT_ERROR,
  DOWNLOAD_DOCUMENT_SUCCESS,
  GET_DOCUMENT,
  GET_DOCUMENT_ERROR,
  GET_DOCUMENT_SUCCESS,
  REMOVE_DOCUMENT,
  REMOVE_DOCUMENT_ERROR,
  REMOVE_DOCUMENT_SUCCESS,
  UPDATE_PUBLIC_DOCUMENT,
  UPDATE_PUBLIC_DOCUMENT_ERROR,
  UPDATE_PUBLIC_DOCUMENT_SUCCESS,
  UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT_ERROR,
  UPLOAD_DOCUMENT_SUCCESS,
  CLEAN_STATE_DOCUMENT, DOWNLOAD_ASSESSMENT, DOWNLOAD_ASSESSMENT_SUCCESS, DOWNLOAD_ASSESSMENT_ERROR,
} from './constants'

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
  assessmentDownloadLoading: false,
  assessmentDownloadSuccess: null,
  assessmentDownloadError: null,
};

/* eslint-disable default-case, no-param-reassign */
const candidateDocumentsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_DOCUMENT:
        draft.loading = true;
        draft.documents = null;
        draft.removed = null;
        draft.uploaded = null;
        draft.download = null;
        draft.updated = false;
        draft.error = null;
        break;
      case GET_DOCUMENT_SUCCESS:
        draft.loading = false;
        draft.documents = action.payload.data;
        draft.error = null;
        break;
      case GET_DOCUMENT_ERROR:
        draft.loading = false;
        draft.documents = null;
        draft.error = action.error || 'Get document faild!';
        break;
      case UPLOAD_DOCUMENT:
        draft.loading = true;
        draft.uploaded = null;
        draft.error = null;
        break;
      case UPLOAD_DOCUMENT_SUCCESS:
        draft.loading = false;
        draft.uploaded = action.payload.data;
        draft.error = null;
        break;
      case UPLOAD_DOCUMENT_ERROR:
        draft.loading = false;
        draft.uploaded = null;
        draft.error = action.error || 'Upload document faild!';
        break;
      case REMOVE_DOCUMENT:
        draft.loading = true;
        draft.removed = null;
        draft.error = null;
        break;
      case REMOVE_DOCUMENT_SUCCESS:
        draft.loading = false;
        draft.removed = action.payload.data;
        draft.error = null;
        break;
      case REMOVE_DOCUMENT_ERROR:
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
      case DOWNLOAD_ASSESSMENT:
        draft.assessmentDownloadLoading = true;
        draft.assessmentDownloadSuccess = null;
        draft.assessmentDownloadError = null;
        break;
      case DOWNLOAD_ASSESSMENT_SUCCESS:
        draft.assessmentDownloadLoading = false;
        draft.assessmentDownloadSuccess = action.payload;
        draft.assessmentDownloadError = null;
        break;
      case DOWNLOAD_ASSESSMENT_ERROR:
        draft.assessmentDownloadLoading = false;
        draft.assessmentDownloadSuccess = null;
        draft.assessmentDownloadError = action.error;
        break;
      case CLEAN_STATE_DOCUMENT:
        draft.loadingDownLoad = false;
        draft.download = null;
        draft.errorDownload = null;
        draft.documents = null;
        draft.loading = false;
        draft.removed = null;
        draft.updated = false;
        draft.uploaded = null;
        draft.error = null;
        draft.assessmentDownloadLoading = false;
        draft.assessmentDownloadSuccess = null;
        draft.assessmentDownloadError = null;
        break;
    }
  });

export default candidateDocumentsReducer;
