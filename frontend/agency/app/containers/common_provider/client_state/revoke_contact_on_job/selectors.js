import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create client state domain
 */

const selectRevokeJobClientStateDomain = state =>
  state.revokeJonClient || initialState;
/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectRevokedLoading = () =>
  createSelector(
    selectRevokeJobClientStateDomain,
    substate => substate.loading,
  );

const makeSelectRevokedSuccess = () =>
  createSelector(
    selectRevokeJobClientStateDomain,
    substate => substate.revoked,
  );
  
const makeSelectRevokedError = () =>
  createSelector(
    selectRevokeJobClientStateDomain,
    substate => substate?.error,
  );

export {
  makeSelectRevokedLoading,
  makeSelectRevokedSuccess,
  makeSelectRevokedError,
};
