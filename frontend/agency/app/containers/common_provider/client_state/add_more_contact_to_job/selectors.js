import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addContactToJob state domain
 */

const selectAddMoreContactToJobDomain = state =>
  state.addMoreContactToJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by addContactToJob
 */

const makeSelectAddMoreContactToJobLoad = () =>
  createSelector(
    selectAddMoreContactToJobDomain,
    substate => substate?.loading,
  );


const makeSelectAddMoreContactToJobResult = () =>
  createSelector(
    selectAddMoreContactToJobDomain,
    substate => substate?.result,
  );

export { makeSelectAddMoreContactToJobLoad, makeSelectAddMoreContactToJobResult };
