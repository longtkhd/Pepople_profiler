import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientContactJobState state domain
 */

const selectClientContactJobDomain = state =>
  state.clientContactJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by clientContactJobState
 */

const makeSelectClientContactJobtate = () =>
  createSelector(
    selectClientContactJobDomain,
    substate => substate?.clientContacts?.data,
  );

const makeSelectClientContactJobtateLoad = () =>
  createSelector(
    selectClientContactJobDomain,
  substate => substate?.loading,
);

export { makeSelectClientContactJobtate,
  makeSelectClientContactJobtateLoad };
