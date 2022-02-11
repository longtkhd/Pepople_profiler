import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the signUpPage state domain
 */

const selectResendVerifyDomain = state => state.resendVerify || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Resend Verify
 */

const makeSelectResendVerifyLoading = () =>
  createSelector(
    selectResendVerifyDomain,
    substate => substate.loading,
  );


const makeSelectResendVerifyError = () =>
  createSelector(
    selectResendVerifyDomain,
    substate => substate.error,
  );

const makeSelectResendVerifyResponse = () =>
  createSelector(
    selectResendVerifyDomain,
    substate => substate.response,
  );

export { 
  makeSelectResendVerifyLoading,
  makeSelectResendVerifyError,
  makeSelectResendVerifyResponse,
};
