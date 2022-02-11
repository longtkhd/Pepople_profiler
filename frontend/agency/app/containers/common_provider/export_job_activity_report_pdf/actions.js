/*
 *
 * ExportCandidateReportPdf actions
 *
 */

import {
  EXPORT_JOB_ACTIVITY_REPORT_PDF,
  EXPORT_JOB_ACTIVITY_REPORT_PDF_SUCCESS,
  EXPORT_JOB_ACTIVITY_REPORT_PDF_FAILED,
  CLEAR_EXPORT_JOB_ACTIVITY_REPORT_PDF
} from './constants';
import { getJobActivityPDFService } from 'services/api/jobService';
import { getClientJobActivityPDFService } from 'services/api/clientJobReportSevice';
import { getHeaderFileName } from '../../../utils/authHelper'

function exportJobActivityReportPdfPdf() {
  return {
    type: EXPORT_JOB_ACTIVITY_REPORT_PDF,
  };
}

function exportJobActivityReportPdfSuccess(response) {
  return {
    type: EXPORT_JOB_ACTIVITY_REPORT_PDF_SUCCESS,
    response
  };
}

function exportJobActivityReportPdfFailed(error) {

  return {
    type: EXPORT_JOB_ACTIVITY_REPORT_PDF_FAILED,
    error
  };
}

function clearExportPdf() {
  return {
    type: CLEAR_EXPORT_JOB_ACTIVITY_REPORT_PDF,
  };
}

export const clearExportPdfAction = () => {
  return async dispatch => {
    
    dispatch(clearExportPdf());
  }
}
export const clientExportPdfAction= (token) => {
  return async dispatch => {
    try {
      
      dispatch(exportJobActivityReportPdfPdf());
      const response = await getClientJobActivityPDFService(token);
      const fileName = getHeaderFileName(response) || `JobActivityReport.pdf`;
      dispatch(exportJobActivityReportPdfSuccess({
        data: response.data, fileName: fileName
      }));

    } catch (err) {
      
      dispatch(exportJobActivityReportPdfFailed(err.response?.data));
      dispatch(clearExportPdfAction())
    }
  }
}

export const jobExportPdfAction = job_id => {
  return async dispatch => {
    try {
      dispatch(exportJobActivityReportPdfPdf());
      const response = await getJobActivityPDFService(job_id);
      const fileName = getHeaderFileName(response) || `JobActivityReport.pdf`;
      dispatch(exportJobActivityReportPdfSuccess({
        data: response.data, fileName: fileName
      }));

    } catch (err) {
      dispatch(exportJobActivityReportPdfFailed(err.response?.data));
      dispatch(clearExportPdfAction())
    }
  }
}
