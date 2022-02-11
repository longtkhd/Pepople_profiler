import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the export candidate report pdf state domain
 */

const selectExportJobActivitytPdfDomain = state => state.exportJobActivityPdf || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExportCandidateReportPdf
 */

const makeSelectExportJobActivityReportPdfLoading = () => {
  return createSelector(
    selectExportJobActivitytPdfDomain,
    substate => substate.loading,
  );
}


const makeSelectExportJobActivityReportPdfResponse =  () => {
  return createSelector(
    selectExportJobActivitytPdfDomain,
    substate => substate.response,
  );
}

const makeSelectExportJobActivityReportPdfError = () =>
  createSelector(
    selectExportJobActivitytPdfDomain,
    substate => substate.error,
  );

export { 
  makeSelectExportJobActivityReportPdfLoading,
  makeSelectExportJobActivityReportPdfResponse,
  makeSelectExportJobActivityReportPdfError,
};
