import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDeleteCandidateDomain = state =>
  state.deleteCandidateState || initialState;

const makeSelectDeleteCandidateResult = () =>
  createSelector(
    selectDeleteCandidateDomain,
    substate => substate?.result,
  );

const makeSelectDeleteCandididateLoad = () =>
  createSelector(
    selectDeleteCandidateDomain,
    substate => substate?.loading,
  );

export { makeSelectDeleteCandidateResult, makeSelectDeleteCandididateLoad };
