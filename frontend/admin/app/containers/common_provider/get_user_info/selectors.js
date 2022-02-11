import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get recruiters state domain
 */

const selectGetUserInfoDomain = state => state.getUserInfo || initialState;



/**
 * Other specific selectors
 */

/**
 * Default selector used by Get User Info
 */

const makeSelectGetUserInfoLoading = () =>
  createSelector(
    selectGetUserInfoDomain,
    substate => substate.loading,
  );


const makeSelectGetUserInfoError = () =>
  createSelector(
    selectGetUserInfoDomain,
    substate => substate.error,
  );

const makeSelectUserInfo = () =>

  createSelector(
    selectGetUserInfoDomain,
    substate => substate.userInfo,
  );

export {
  makeSelectGetUserInfoLoading,
  makeSelectGetUserInfoError,
  makeSelectUserInfo,
};
