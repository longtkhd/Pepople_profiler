import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createJobState state domain
 */

const selectDeleteClientStateDomain = state =>
  state.deleteClientState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateJobState
 */

const makeSelectDeleteClientResult = () =>
  createSelector(
    selectDeleteClientStateDomain,
    substate => substate?.result,
  );

const makeSelectDeleteClientLoading = () =>
  createSelector(
    selectDeleteClientStateDomain,
    substate => substate?.loading,
  );

export { makeSelectDeleteClientResult, makeSelectDeleteClientLoading, };
