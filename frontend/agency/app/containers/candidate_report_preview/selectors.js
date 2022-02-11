import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the candidateReportPreview state domain
 */

const selectCandidateReportPreviewDomain = state =>
  state.candidateReportPreview || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CandidateReportPreview
 */

const makeSelectCandidateInfoLoading = () =>
  createSelector(
    selectCandidateReportPreviewDomain,
    substate => substate.candidateLoading,
  );
const makeSelectCandidateInfoSuccess = () =>
  createSelector(
    selectCandidateReportPreviewDomain,
    substate => substate.candidateInfo,
  );
const makeSelectCandidateInfoError = () =>
  createSelector(
    selectCandidateReportPreviewDomain,
    substate => substate.candidateError,
  );


export { 
  makeSelectCandidateInfoLoading ,
  makeSelectCandidateInfoSuccess,
  makeSelectCandidateInfoError
};
