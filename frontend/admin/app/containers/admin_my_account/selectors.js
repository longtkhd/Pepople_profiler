import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminMyAccount state domain
 */

const selectAdminMyAccountDomain = state =>
  state.adminMyAccount || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminMyAccount
 */

const makeSelectAdminMyAccount = () =>
  createSelector(
    selectAdminMyAccountDomain,
    substate => substate,
  );

  const makeSelectChangePasswordLoading = () =>
    createSelector(
        selectAdminMyAccountDomain,
        substate => substate.loading,
    );


const makeSelectChangePasswordError = () =>
    createSelector(
        selectAdminMyAccountDomain,
        substate => substate.error,
    );

const makeSelectChangePasswordSuccess = () =>
    createSelector(
        selectAdminMyAccountDomain,
        substate => substate.success,
    );

export {
  makeSelectAdminMyAccount,
  makeSelectChangePasswordError,
  makeSelectChangePasswordLoading,
  makeSelectChangePasswordSuccess
};
