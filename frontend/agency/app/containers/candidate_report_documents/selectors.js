import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the candidateReportDocuments state domain
 */

const selectCandidateReportDocumentsDomain = state =>
  state.candidateReportDocuments || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CandidateReportDocuments
 */

const makeSelectDocumentsLoading = () =>
  createSelector(
    selectCandidateReportDocumentsDomain,
    substate => substate.loading,
  );
const makeSelectDocumentsSuccess = () =>
  createSelector(
    selectCandidateReportDocumentsDomain,
    substate => substate.documents,
  );
const makeSelectDocumentsError = () =>
  createSelector(
    selectCandidateReportDocumentsDomain,
    substate => substate.error,
  );

const makeSelectUploadDocumentsSuccess = () =>
  createSelector(
    selectCandidateReportDocumentsDomain,
    substate => substate.uploaded,
  );

const makeSelectRemoveDocumentSuccess = () =>
createSelector(
  selectCandidateReportDocumentsDomain,
  substate => substate.removed,
);

const makeSelectDownloadDocumentSuccess = () =>
createSelector(
  selectCandidateReportDocumentsDomain,
  substate => substate.download,
);

const makeSelectDownloadDocumentLoading = () =>
createSelector(
  selectCandidateReportDocumentsDomain,
  substate => substate.loadingDownLoad,
);

const makeSelectDownloadDocumentError = () =>
createSelector(
  selectCandidateReportDocumentsDomain,
  substate => substate.errorDownload,
);

const makeSelectUpdatePublicDocumentSuccess = () =>
createSelector(
  selectCandidateReportDocumentsDomain,
  substate => substate.updated,
);

export { 
  makeSelectDocumentsError, 
  makeSelectDocumentsLoading, 
  makeSelectDocumentsSuccess, 
  makeSelectUploadDocumentsSuccess,
  makeSelectRemoveDocumentSuccess,
  makeSelectDownloadDocumentSuccess,
  makeSelectUpdatePublicDocumentSuccess,
  makeSelectDownloadDocumentError,
  makeSelectDownloadDocumentLoading
};
