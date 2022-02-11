import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update agency state domain
 */

const selectUpdateUserDomain = state => state.updateUser || initialState;


/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectUpdateUserLoading = () =>
    createSelector(
        selectUpdateUserDomain,
        substate => substate.loading,
    );


const makeSelectUpdateUserError = () =>
    createSelector(
        selectUpdateUserDomain,
        substate => substate.error,
    );

const makeSelectUpdateUserSuccess = () =>
    createSelector(
        selectUpdateUserDomain,
        substate => substate.success,

    );


export {
    makeSelectUpdateUserLoading,
    makeSelectUpdateUserError,
    makeSelectUpdateUserSuccess

};
