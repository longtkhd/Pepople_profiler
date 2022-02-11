import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the setupAgencyPage state domain
 */

const selectSetupAgencyPageDomain = state =>
  state.setupAgencyPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SetupAgencyPage
 */

const makeSelectLoading = () =>
createSelector(
  selectSetupAgencyPageDomain,
  substate => substate.loading,
);


const makeSelectCheckTokenError = () =>
createSelector(
  selectSetupAgencyPageDomain,
  substate => substate.checkTokenError,
);

const makeSelectUser = () =>
createSelector(
  selectSetupAgencyPageDomain,
  substate => substate.user,
);

const makeSelectSetupToken = () =>
createSelector(
  selectSetupAgencyPageDomain,
  substate => substate.setupToken,
);

export {
  selectSetupAgencyPageDomain,
  makeSelectLoading,
  makeSelectCheckTokenError, 
  makeSelectUser,
  makeSelectSetupToken
};
