import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editJobState state domain
 */

const selectEditJobDomain = state =>
  state.editJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by editJobState
 */

const makeSelectEditJobResult= () =>
  createSelector(
    selectEditJobDomain,
    substate => substate?.result
  );

const makeSelectEditJobLoading = () =>
  createSelector(
  selectEditJobDomain,
  substate => substate?.loading,
);

export { makeSelectEditJobResult, makeSelectEditJobLoading };
