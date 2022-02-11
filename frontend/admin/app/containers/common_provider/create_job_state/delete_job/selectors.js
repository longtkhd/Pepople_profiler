import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the deleteJobState state domain
 */

const selectDeteleJobDomain = state =>
  state.deleteJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by deleteJobState
 */

const makeSelectDeleteJobResult = () =>
  createSelector(
    selectDeteleJobDomain,
    substate => substate?.result
  );

  const makeSelectDeleteJobLoading = () =>
  createSelector(
    selectDeteleJobDomain,
    substate => substate?.loading
  );

export { makeSelectDeleteJobLoading, makeSelectDeleteJobResult };
