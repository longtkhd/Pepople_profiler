import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectListCandidateAddedDomain = state => state.listCandidateAddedState || initialState;

const makeSelectListCandidateAdded = () =>
  createSelector(
    selectListCandidateAddedDomain,
    substate => substate?.candidateAdded,
  );

const makeSelectAddExistingResult = () =>
  createSelector(
    selectListCandidateAddedDomain,
    substate => substate?.result,
  );

const makeSelectAddExistingLoading = () =>
  createSelector(
    selectListCandidateAddedDomain,
    substate => substate?.loading,
  );

const makeSelectPercentAddCandidate = () =>
  createSelector(
    selectListCandidateAddedDomain,
    substate => substate?.percent,
  );

export {
  makeSelectListCandidateAdded,
  makeSelectAddExistingResult,
  makeSelectAddExistingLoading,
  makeSelectPercentAddCandidate,
};
