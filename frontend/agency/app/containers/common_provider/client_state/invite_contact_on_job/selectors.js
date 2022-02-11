import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inviteContactJobState state domain
 */

const selectInviteContactJobStateDomain = state =>
  state.inviteContactJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by inviteContactJobState
 */

const makeSelectInviteContactJobLoad = () =>
  createSelector(
    selectInviteContactJobStateDomain,
    substate => substate?.loading,
  );

const makeSelectInviteContactJobResult = () =>
  createSelector(
    selectInviteContactJobStateDomain,
    substate => substate?.result,
  );

const makeSelectInviteError = () =>
  createSelector(
    selectInviteContactJobStateDomain,
    substate => substate?.error,
  );

export { makeSelectInviteContactJobLoad, makeSelectInviteContactJobResult, makeSelectInviteError };
