import { createSelector } from 'reselect';
import { initialState } from './reducer';


const selectCandidateDocumentsDomain = state =>
  state.candidateDocuments || initialState;

const makeSelectDocumentsLoading = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.loading,
  );
const makeSelectDocumentsSuccess = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.documents,
  );
const makeSelectDocumentsError = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.error,
  );

const makeSelectUploadDocumentsSuccess = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.uploaded,
  );

const makeSelectRemoveDocumentSuccess = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.removed,
  );

const makeSelectDownloadDocumentSuccess = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.download,
  );

const makeSelectDownloadDocumentLoading = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.loadingDownLoad,
  );

const makeSelectDownloadDocumentError = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.errorDownload,
  );

const makeSelectUpdatePublicDocumentSuccess = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.updated,
  );

const makeSelectDownloadAssessmentLoading = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.assessmentDownloadLoading,
  );

const makeSelectDownloadAssessmentSuccess = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.assessmentDownloadSuccess,
  );

const makeSelectDownloadAssessmentError = () =>
  createSelector(
    selectCandidateDocumentsDomain,
    substate => substate.assessmentDownloadError,
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
  makeSelectDownloadDocumentLoading,
  makeSelectDownloadAssessmentLoading,
  makeSelectDownloadAssessmentSuccess,
  makeSelectDownloadAssessmentError
};
