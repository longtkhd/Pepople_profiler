/*
 *
 * CandidateReportForm reducer
 *
 */
import produce from 'immer';
import {
  CLEAN_ORIGINAL,
  CLEAR_INVITE_ASSESSMENT,
  CLEAR_PROJECT_ASSESSMENT,
  GET_ASSESSMENT_INDUSTRY,
  GET_ASSESSMENT_INDUSTRY_ERROR,
  GET_ASSESSMENT_INDUSTRY_SUCCESS,
  GET_ASSESSMENT_TYPE,
  GET_ASSESSMENT_TYPE_ERROR,
  GET_ASSESSMENT_TYPE_SUCCESS,
  GET_ORIGINAL,
  GET_ORIGINAL_ERROR,
  GET_ORIGINAL_SUCCESS,
  GET_PROJECT_ASSESSMENT,
  GET_PROJECT_ASSESSMENT_ERROR,
  GET_PROJECT_ASSESSMENT_SUCCESS,
  RESEND_INVITE_ASSESSMENT,
  RESEND_INVITE_ASSESSMENT_ERROR,
  RESEND_INVITE_ASSESSMENT_SUCCESS,
  SEND_INVITE_ASSESSMENT,
  SEND_INVITE_ASSESSMENT_ERROR,
  SEND_INVITE_ASSESSMENT_SUCCESS,
  UPLOAD_ORIGINAL,
  UPLOAD_ORIGINAL_ERROR,
  UPLOAD_ORIGINAL_SUCCESS,
} from './constants'

export const initialState = {
  loadingIndustry: false,
  errorIndustry: false,
  industry: null,
  loadingType: null,
  errorType: null,
  type: null,
  project: null,
  loadingProject: false,
  errorProject: null,
  invited: false,
  loadingInvited: false,
  errorInvited: null,
  original: null,
  originalLoading: false,
  originalError: null,
  uploadOriginal: null,
  uploadOriginalLoading: false,
  uploadOriginalError: null,
  loadingResend: false,
  errorResend: null,
  resend: false,
};

/* eslint-disable default-case, no-param-reassign */
const candidateReportFormReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ASSESSMENT_INDUSTRY:
        draft.loadingIndustry = true;
        draft.industry = null;
        draft.errorIndustry = null;
        break;
      case GET_ASSESSMENT_INDUSTRY_SUCCESS:
        draft.loadingIndustry = false;
        draft.industry = action.payload;
        draft.errorIndustry = null;
        break;
      case GET_ASSESSMENT_INDUSTRY_ERROR:
        draft.loadingIndustry = false;
        draft.industry = action.error;
        draft.errorIndustry = null;
        break;
      case GET_ASSESSMENT_TYPE:
        draft.loadingType = true;
        draft.type = null;
        draft.errorType = null;
        break;
      case GET_ASSESSMENT_TYPE_SUCCESS:
        draft.loadingType = false;
        draft.type = action.payload;
        draft.errorType = null;
        break;
      case GET_ASSESSMENT_TYPE_ERROR:
        draft.loadingType = false;
        draft.type = null;
        draft.errorType = action.error;
        break;
      case GET_PROJECT_ASSESSMENT:
        draft.loadingProject = true;
        draft.project = null;
        draft.errorProject = null;
        break;
      case GET_PROJECT_ASSESSMENT_SUCCESS:
        draft.loadingProject = false;
        draft.project = action.payload.data;
        draft.errorProject = null;
        break;
      case GET_PROJECT_ASSESSMENT_ERROR:
        draft.loadingProject = false;
        draft.project = null;
        draft.errorProject = action.error;
        break
      case CLEAR_PROJECT_ASSESSMENT:
        draft.loadingProject = false;
        draft.project = null;
        draft.errorProject = null;
        break;
      case SEND_INVITE_ASSESSMENT:
        draft.loadingInvited = true;
        draft.invited = false;
        draft.errorInvited = null;
        break;
      case SEND_INVITE_ASSESSMENT_SUCCESS:
        draft.loadingInvited = false;
        draft.invited = true;
        draft.errorInvited = null;
        break;
      case SEND_INVITE_ASSESSMENT_ERROR:
        draft.loadingInvited = false;
        draft.invited = false;
        draft.errorInvited = action.error;
        break;
      case RESEND_INVITE_ASSESSMENT:
        draft.loadingResend = true;
        draft.resend = false;
        draft.errorResend = null;
        break;
      case RESEND_INVITE_ASSESSMENT_SUCCESS:
        draft.loadingResend = false;
        draft.resend = true;
        draft.errorResend = null;
        break;
      case RESEND_INVITE_ASSESSMENT_ERROR:
        draft.loadingResend = false;
        draft.resend = false;
        draft.errorResend = 'Resend error!';
        break;
      case CLEAR_INVITE_ASSESSMENT:
        draft.loadingInvited = false;
        draft.invited = false;
        draft.errorInvited = null;
        draft.loadingResend = false;
        draft.resend = false;
        draft.errorResend = null;
        break;
      case GET_ORIGINAL:
        draft.originalLoading = true;
        draft.original = null;
        draft.originalError = null;
        break;
      case GET_ORIGINAL_SUCCESS:
        draft.originalLoading = false;
        draft.original = action.payload.data;
        draft.originalError = null;
        break;
      case GET_ORIGINAL_ERROR:
        draft.originalLoading = false;
        draft.original = null;
        draft.originalError = action.error;
        break;
      case UPLOAD_ORIGINAL:
        draft.uploadOriginalLoading = true;
        draft.uploadOriginal = null;
        draft.uploadOriginalError = action.error;
        break;
      case UPLOAD_ORIGINAL_SUCCESS:
        draft.uploadOriginalLoading = false;
        draft.uploadOriginal = action.payload.data;
        draft.uploadOrigalError = null;
        break;
      case UPLOAD_ORIGINAL_ERROR:
        draft.uploadOriginalLoading = false;
        draft.uploadOriginal = null;
        draft.uploadOrigalError = action.error;
        break;
      case CLEAN_ORIGINAL:
        draft.uploadOriginalLoading = false;
        draft.uploadOriginal = null;
        draft.uploadOrigalError = null;
        draft.original = null;
        draft.originalLoading = false;
        draft.originalError = null;
        break;
    }
  });

export default candidateReportFormReducer;
