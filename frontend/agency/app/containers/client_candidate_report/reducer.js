/*
 *
 * Clientcandidatereport reducer
 *
 */
import produce from 'immer';
import {
  GET_CANDIDATE_REPORT,
  GET_CANDIDATE_REPORT_ERROR,
  GET_CANDIDATE_REPORT_SUCCESS,
  UPDATE_CLIENT_FEEDBACK,
  UPDATE_CLIENT_FEEDBACK_SUCCESS,
  UPDATE_CLIENT_FEEDBACK_ERROR,
  GET_CLIENT_FEEDBACK,
  GET_CLIENT_FEEDBACK_SUCCESS,
  GET_CLIENT_FEEDBACK_ERROR,
  DOWNLOAD_DOCUMENT,
  DOWNLOAD_DOCUMENT_SUCCESS,
  DOWNLOAD_DOCUMENT_ERROR,
  CLEAR_ALL,
} from './constants';

export const initialState = {
  loadingCandidate: false,
  errorCandidate: null,
  candidateInfo: null,
  feedback: null,
  errorFeedback: null,
  loadingFeedback: false,
  updateFeedback: null,
  download: null,
  loadingDownload: false,
  errorDownload: false,
};

/* eslint-disable default-case, no-param-reassign */
const clientcandidatereportReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_CANDIDATE_REPORT:
        draft.loadingCandidate = true;
        draft.errorCandidate = null;
        draft.candidateInfo = null;
        break;
      case GET_CANDIDATE_REPORT_SUCCESS:
        draft.loadingCandidate = false;
        draft.errorCandidate = null;
        draft.candidateInfo = action.payload.data;
        break;
      case GET_CANDIDATE_REPORT_ERROR:
        draft.loadingCandidate = false;
        draft.errorCandidate = action.error;
        draft.candidateInfo = null;
        break;
      case UPDATE_CLIENT_FEEDBACK:
        draft.loadingCandidate = true;
        draft.errorFeedback = null;
        draft.updateFeedback = null;
        break;
      case UPDATE_CLIENT_FEEDBACK_SUCCESS:
        draft.loadingCandidate = false;
        draft.errorFeedback = null;
        draft.updateFeedback = action.payload.data;
        break;
      case UPDATE_CLIENT_FEEDBACK_ERROR:
        draft.loadingCandidate = false;
        draft.errorFeedback = action.error;
        draft.updateFeedback = null;
        break;
      case GET_CLIENT_FEEDBACK:
        draft.loadingFeedback = true;
        draft.errorFeedback = null;
        draft.feedback = null;
        break;
      case GET_CLIENT_FEEDBACK_SUCCESS:
        draft.loadingFeedback = false;
        draft.errorFeedback = null;
        draft.feedback = action.payload.data;
        break;
      case GET_CLIENT_FEEDBACK_ERROR:
        draft.loadingFeedback = false;
        draft.errorFeedback = action.error;
        draft.feedback = null;
        break;
      case DOWNLOAD_DOCUMENT:
        draft.loadingDownload = true;
        draft.errorDownload = null;
        draft.download = null;
        break;
      case DOWNLOAD_DOCUMENT_SUCCESS:
        draft.loadingDownload = false;
        draft.errorDownload = null;
        draft.download = action.payload;
        break;
      case DOWNLOAD_DOCUMENT_ERROR:
        draft.loadingDownload = false;
        draft.errorDownload = action.error;
        draft.download = null;
        break;
      case CLEAR_ALL:
        draft.loadingCandidate= false;
        draft.errorCandidate= null;
        draft.candidateInfo= null;
        draft.feedback= null;
        draft.errorFeedback= null;
        draft.updateFeedback= null;
        draft.download= null;
        draft.loadingDownload= false;
        draft.errorDownload= false;
        draft.loadingFeedback = false;
        break;
    }
  });

export default clientcandidatereportReducer;
