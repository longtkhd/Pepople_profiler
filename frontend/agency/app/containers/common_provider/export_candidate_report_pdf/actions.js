/*
 *
 * ExportCandidateReportPdf actions
 *
 */

import {
  EXPORT_CANDIDATE_REPORT_PDF,
  EXPORT_CANDIDATE_REPORT_PDF_SUCCESS,
  EXPORT_CANDIDATE_REPORT_PDF_FAILED,
  CLEAR_EXPORT_CANDIDATE_REPORT_PDF,
} from './constants';
import { exportReportPdf, clientExportPdfService } from 'services/api/candidateService';
import { getHeaderFileName } from '../../../utils/authHelper'

function exportCandidateReportPdf() {
  return {
    type: EXPORT_CANDIDATE_REPORT_PDF,
  };
}

function exportCandidateReportPdfSuccess(response) {
  return {
    type: EXPORT_CANDIDATE_REPORT_PDF_SUCCESS,
    response
  };
}

function exportCandidateReportPdfFailed(error) {
  return {
    type: EXPORT_CANDIDATE_REPORT_PDF_FAILED,
    error
  };
}

export function clearExportPdfAction(){
  return {
    type: CLEAR_EXPORT_CANDIDATE_REPORT_PDF
  }
}

export const clientExportPdfAction = data => {
  return async dispatch => {
    try {
      dispatch(exportCandidateReportPdf());
      const response = await clientExportPdfService(data);
      const fileName = getHeaderFileName(response) || `CandidateReport.zip`;
      dispatch(exportCandidateReportPdfSuccess({
        data: response.data, fileName: fileName
      }));
      dispatch(clearExportPdfAction())
    } catch (err) {
      dispatch(exportCandidateReportPdfFailed(err.response?.data));
      dispatch(clearExportPdfAction())
    }
  }
}

export default data => {
  return async dispatch => {
    try {
      dispatch(exportCandidateReportPdf());
      const response = await exportReportPdf(data);
      const fileName = getHeaderFileName(response) || `CandidateReport.zip`;
      dispatch(exportCandidateReportPdfSuccess({
        data: response.data, fileName: fileName
      }));
    } catch (err) {
      dispatch(exportCandidateReportPdfFailed(err.response?.data));
    }
  }
}
