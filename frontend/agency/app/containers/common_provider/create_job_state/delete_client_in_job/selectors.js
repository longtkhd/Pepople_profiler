import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the deleteJobState state domain
 */

const selectDeleteContactJobDomain = state =>
  state.deleteContactJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by deleteJobState
 */

const makeSelectDeleteContactJobResult = () =>
  createSelector(
    selectDeleteContactJobDomain,
    substate => substate?.result
  );

  const makeSelectDeleteContactJobLoading = () =>
  createSelector(
    selectDeleteContactJobDomain,
    substate => substate?.loading
  );

export { makeSelectDeleteContactJobLoading, makeSelectDeleteContactJobResult };
