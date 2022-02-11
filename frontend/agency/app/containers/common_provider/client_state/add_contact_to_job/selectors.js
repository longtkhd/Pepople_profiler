import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addContactToJob state domain
 */

const selectAddContactToJobDomain = state =>
  state.addContactToJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by addContactToJob
 */

const makeSelectAddContactToJobLoad = () =>
  createSelector(
    selectAddContactToJobDomain,
    substate => substate?.loading,
  );


const makeSelectAddContactToJobResult = () =>
  createSelector(
    selectAddContactToJobDomain,
    substate => substate?.result,
  );

export { makeSelectAddContactToJobLoad, makeSelectAddContactToJobResult };
