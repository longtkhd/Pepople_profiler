import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCandidateDetailDomain = state =>
  state.candidateDetailState || initialState;

const makeSelectCandidateDetailLoading = () =>
  createSelector(
    selectCandidateDetailDomain,
    substate => substate?.loading,
  );

const makeSelectCandidateDetailResult = () =>
  createSelector(
    selectCandidateDetailDomain,
    substate => substate?.result?.data,
  );

const makeSelectCandidateDetailError = () =>
  createSelector(
    selectCandidateDetailDomain,
    substate => substate?.error,
  );

export {
  makeSelectCandidateDetailLoading,
  makeSelectCandidateDetailResult,
  makeSelectCandidateDetailError
};
