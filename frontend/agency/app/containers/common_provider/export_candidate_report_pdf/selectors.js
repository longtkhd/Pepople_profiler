import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the export candidate report pdf state domain
 */

const selectExportCandidateReportPdfDomain = state => state.exportCandidateReportPdf || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExportCandidateReportPdf
 */

const makeSelectExportCandidateReportPdfLoading = () =>
  createSelector(
    selectExportCandidateReportPdfDomain,
    substate => substate.loading,
  );

const makeSelectExportCandidateReportPdfResponse = () =>
  createSelector(
    selectExportCandidateReportPdfDomain,
    substate => substate.response,
  );

const makeSelectExportCandidateReportPdfError = () =>
  createSelector(
    selectExportCandidateReportPdfDomain,
    substate => substate.error,
  );

export { 
  makeSelectExportCandidateReportPdfLoading,
  makeSelectExportCandidateReportPdfResponse,
  makeSelectExportCandidateReportPdfError,
};
