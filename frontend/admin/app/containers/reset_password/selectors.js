import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the resetPassword state domain
 */

const selectResetPasswordDomain = state => state.resetPassword || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ResetPassword
 */

const makeSelectResetPassword = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate,
  );

  const makeSelectCheckTokenLoading = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate.checkTokenLoading,
  );
const makeSelectCheckTokenError = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate.checkTokenError,
  );
const makeSelectCheckTokenResponse = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate.checkTokenResponse,
  );
const makeSelectResetPasswordLoading = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate.resetPasswordLoading,
  );

const makeSelectResetPasswordError = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate.resetPasswordError,
  );

const makeSelectResetPasswordResponse = () =>
  createSelector(
    selectResetPasswordDomain,
    substate => substate.resetPasswordResponse,
  );



export {
  makeSelectCheckTokenLoading,
  makeSelectCheckTokenError,
  makeSelectCheckTokenResponse,
  makeSelectResetPasswordLoading,
  makeSelectResetPasswordError,
  makeSelectResetPasswordResponse,
  makeSelectResetPassword
};
