import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editContactClientState state domain
 */

const selectEditContactClientStateDomain = state =>
  state.editContactClientState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by editContactClientState
 */

const makeSelectEditClientContactLoad = () =>
  createSelector(
    selectEditContactClientStateDomain,
    substate => substate?.loading,
  );


const makeSelectEditClientContactResult = () =>
  createSelector(
    selectEditContactClientStateDomain,
    substate => substate?.result,
  );

export { makeSelectEditClientContactLoad, makeSelectEditClientContactResult };
