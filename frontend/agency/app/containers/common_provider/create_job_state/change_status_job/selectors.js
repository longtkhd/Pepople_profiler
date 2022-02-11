import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the changeStatusJobState state domain
 */

const selectDeteleJobDomain = state =>
  state.changeStatusJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by changeStatusJobState
 */

const makeSelectChangeStatusJobResult = () =>
  createSelector(
    selectDeteleJobDomain,
    substate => substate?.result
  );

  const makeSelectChangeStatusJobLoading = () =>
  createSelector(
    selectDeteleJobDomain,
    substate => substate?.loading
  );

export { makeSelectChangeStatusJobLoading, makeSelectChangeStatusJobResult };
