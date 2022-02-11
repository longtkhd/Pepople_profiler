import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createContactClientState state domain
 */

const selectCreateContactClientDomain = state =>
  state.createContactClientState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by createContactClientState
 */

const makeSelectCreateContactClientLoad = () =>
  createSelector(
    selectCreateContactClientDomain,
    substate => substate?.loading,
  );

const makeSelectCreateContactClientResult = () =>
  createSelector(
    selectCreateContactClientDomain,
    substate => substate?.result,
  );

export {
  makeSelectCreateContactClientLoad,
  makeSelectCreateContactClientResult,
};
