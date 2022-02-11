import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = state => state.loginPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectUserData = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.userData,
  );

const makeSelectLoading = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.loading,
  );


const makeSelectError = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.error,
  );

export {
  selectLoginPageDomain,
  makeSelectUserData,
  makeSelectLoading,
  makeSelectError,
};
