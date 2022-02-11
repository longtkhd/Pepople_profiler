import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientContactInJobState state domain
 */

const selectClientContactInJobDomain = state =>
  state.clientContactInJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by clientContactInJobState
 */

const makeSelectClientContactInJobState = () =>
  createSelector(
    selectClientContactInJobDomain,
    substate => substate?.contactInJob?.data,
  );

const makeSelectClientContactInJobStateLoad = () =>
  createSelector(
    selectClientContactInJobDomain,
  substate => substate?.loading,
);

export { makeSelectClientContactInJobState,
  makeSelectClientContactInJobStateLoad };
