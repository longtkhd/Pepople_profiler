/*
 *
 * ExportCandidateReportPdf reducer
 *
 */
import produce from 'immer';
import {
  EXPORT_JOB_ACTIVITY_REPORT_PDF ,
  EXPORT_JOB_ACTIVITY_REPORT_PDF_SUCCESS,
  EXPORT_JOB_ACTIVITY_REPORT_PDF_FAILED,  
  CLEAR_EXPORT_JOB_ACTIVITY_REPORT_PDF,
} from './constants'

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const exportJobActivityPdfReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case EXPORT_JOB_ACTIVITY_REPORT_PDF:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case EXPORT_JOB_ACTIVITY_REPORT_PDF_SUCCESS:
        draft.error = null;
        draft.loading = false; 
        draft.response = action.response;
        break;
      case EXPORT_JOB_ACTIVITY_REPORT_PDF_FAILED:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null; 
        break; 
      case CLEAR_EXPORT_JOB_ACTIVITY_REPORT_PDF:
        draft.error = null;
        draft.loading = false;
        draft.response = null;
        break;
      default:   
        break;
    }
  });

export default exportJobActivityPdfReducer;
