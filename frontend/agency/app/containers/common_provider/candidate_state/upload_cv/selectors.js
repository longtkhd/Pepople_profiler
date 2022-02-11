import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create client state domain
 */

const selectCandidateUploadDomain = state =>
  state.candidateUploadState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectCandidatePreview = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.previewCandidates,
  );
const makeSelectCandidateExistsPreview = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.previewCandidatesExists,
  );


const makeSelectPercentUploadCandidate = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.percentUpload,
  );
const makeSelectStatusParseCv = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.statusParseCv,
  );

const makeSelectCandidateUploading = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.loading,
  );

const makeSelectCandidateUploadSuccess = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.result,
  );

const makeSelectCandidateUploadResult = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.result?.data?.list,
  );
  const makeSelectCancellingUpload = () =>
  createSelector(
    selectCandidateUploadDomain,
    substate => substate?.isCancelling,
  );


export {
  makeSelectCandidatePreview,
  makeSelectCandidateExistsPreview,
  makeSelectPercentUploadCandidate,
  makeSelectCandidateUploading,
  makeSelectCandidateUploadSuccess,
  makeSelectCandidateUploadResult,
  makeSelectCancellingUpload,
  makeSelectStatusParseCv,
};
