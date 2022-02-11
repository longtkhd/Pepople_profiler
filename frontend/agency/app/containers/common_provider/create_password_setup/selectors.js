import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create password state domain
 */

const selectCreatePasswordDomain = state => state.createPasswordSetup || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectCreatePasswordLoading = () =>
  createSelector(
    selectCreatePasswordDomain,
    substate => substate.loading,
  );


const makeSelectCreatePasswordError = () =>
  createSelector(
    selectCreatePasswordDomain,
    substate => substate.error,
  );

const makeSelectCreatePasswordResponse = () =>
  createSelector(
    selectCreatePasswordDomain,
    substate => substate.response,
  );

export { 
  makeSelectCreatePasswordLoading,
  makeSelectCreatePasswordError,
  makeSelectCreatePasswordResponse,
};
