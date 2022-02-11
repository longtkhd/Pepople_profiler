import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientcandidatereport state domain
 */

const selectClientcandidatereportDomain = state =>
  state.clientcandidatereport || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Clientcandidatereport
 */

const makeSelectClientCandidateReportLoading = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.loadingCandidate,
  );
const makeSelectClientCandidateReportSuccess = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.candidateInfo,
  );
const makeSelectClientCandidateReportError = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.errorCandidate,
  );

const makeSelectUpdateFeedbackSuccess = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.updateFeedback,
  );
const makeSelectUpdateFeedbackError = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.errorFeedback,
  );

const makeSelectGetClientFeedbackSuccess = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.feedback,
  );

const makeSelectGetClientFeedbackError = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.errorFeedback,
  );
const makeSelectGetClientFeedbackloading = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.loadingFeedback,
  );

const makeSelectDownloadDocumentLoading = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.loadingDownload,
  );

const makeSelectDownloadDocumentSuccess = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.download,
  );

const makeSelectDownloadDocumentError = () =>
  createSelector(
    selectClientcandidatereportDomain,
    substate => substate.errorDownload,
  );

export {
  makeSelectClientCandidateReportError,
  makeSelectClientCandidateReportSuccess,
  makeSelectClientCandidateReportLoading,
  makeSelectUpdateFeedbackError,
  makeSelectUpdateFeedbackSuccess,
  makeSelectGetClientFeedbackError,
  makeSelectGetClientFeedbackSuccess,
  makeSelectDownloadDocumentError,
  makeSelectDownloadDocumentLoading,
  makeSelectDownloadDocumentSuccess,
  makeSelectGetClientFeedbackloading
};
