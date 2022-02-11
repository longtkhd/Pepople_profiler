import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the fogotPassword state domain
 */

const selectForgotPasswordDomain = state => state.forgotPassword || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by FogotPassword
 */

const makeSelectFogotPassword = () =>
  createSelector(
    selectForgotPasswordDomain,
    substate => substate,
  );

  const makeSelectForgotPasswordLoading = () =>
  createSelector(
    selectForgotPasswordDomain,
    substate => substate.loading,
  );

const makeSelectForgotPasswordError = () =>
  createSelector(
    selectForgotPasswordDomain,
    substate => substate.error,
  );

const makeSelectForgotPasswordResponse = () =>
  createSelector(
    selectForgotPasswordDomain,
    substate => substate.response,
  );


export { 
  makeSelectForgotPasswordLoading,
  makeSelectForgotPasswordError,
  makeSelectForgotPasswordResponse,
  makeSelectFogotPassword
};

