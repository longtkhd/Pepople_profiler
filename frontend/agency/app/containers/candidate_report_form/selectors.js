import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the candidateReportForm state domain
 */

const selectCandidateReportFormDomain = state =>
  state.candidateReportForm || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CandidateReportForm
 */

const makeSelectAssessmentIndustryLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.loadingIndustry,
  );

const makeSelectAssessmentIndustrySuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.industry,
  );

const makeSelectAssessmentIndustryError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.errorIndustry,
  );

const makeSelectAssessmentTypeLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.loadingType,
  );
const makeSelectAssessmentTypeSuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.type,
  );
const makeSelectAssessmentTypeError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.errorType,
  );

const makeSelectProjectAssessmentLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.loadingProject,
  );
const makeSelectProjectAssessmentSuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.project,
  );
const makeSelectProjectAssessmentError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.errorProject,
  );

const makeSelectInviteAssessmentLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.loadingInvited,
  );
const makeSelectInviteAssessmentSuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.invited,
  );
const makeSelectInviteAssessmentError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.errorInvited,
  );

const makeSelectGetOriginalLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.originalLoading,
  );
const makeSelectGetOriginalSuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.original,
  );
const makeSelectGetOriginalError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.originalError,
  );

const makeSelectUploadOriginalLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.uploadOriginalLoading,
  );
const makeSelectUploadOriginalSuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.uploadOriginal,
  );
const makeSelectUploadOriginalError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.uploadOrigalError,
  );

const makeSelectResendAssessmentLoading = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.loadingResend,
  );
const makeSelectResendAssessmentSuccess = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.resend,
  );
const makeSelectResendAssessmentError = () =>
  createSelector(
    selectCandidateReportFormDomain,
    substate => substate.errorResend,
  );

export {
  makeSelectAssessmentIndustryError,
  makeSelectAssessmentIndustryLoading,
  makeSelectAssessmentIndustrySuccess,
  makeSelectAssessmentTypeError,
  makeSelectAssessmentTypeLoading,
  makeSelectAssessmentTypeSuccess,
  makeSelectProjectAssessmentLoading,
  makeSelectProjectAssessmentError,
  makeSelectProjectAssessmentSuccess,
  makeSelectInviteAssessmentError,
  makeSelectInviteAssessmentLoading,
  makeSelectInviteAssessmentSuccess,
  makeSelectGetOriginalError,
  makeSelectGetOriginalLoading,
  makeSelectGetOriginalSuccess,
  makeSelectUploadOriginalError,
  makeSelectUploadOriginalLoading,
  makeSelectUploadOriginalSuccess,
  makeSelectResendAssessmentError,
  makeSelectResendAssessmentLoading,
  makeSelectResendAssessmentSuccess
};
