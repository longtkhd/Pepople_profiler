import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the change password state domain
 */

const selectChangePasswordDomain = state => state.changePassword || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectChangePasswordLoading = () =>
    createSelector(
        selectChangePasswordDomain,
        substate => substate.loading,
    );


const makeSelectChangePasswordError = () =>
    createSelector(
        selectChangePasswordDomain,
        substate => substate.error,
    );

const makeSelectChangePasswordSuccess = () =>
    createSelector(
        selectChangePasswordDomain,
        substate => substate.success,
    );

export {
    makeSelectChangePasswordLoading,
    makeSelectChangePasswordError,
    makeSelectChangePasswordSuccess,
};
