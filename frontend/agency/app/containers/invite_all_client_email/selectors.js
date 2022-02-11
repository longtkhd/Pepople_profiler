import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inviteAllClientEmail state domain
 */

const selectInviteAllClientEmailDomain = state =>
  state.inviteAllClientEmail || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by InviteAllClientEmail
 */

const makeSelectInviteAllClientEmail = () =>
  createSelector(
    selectInviteAllClientEmailDomain,
    substate => substate,
  );

const makeSelectInviteClientEmailInfoSuccess = () =>
  createSelector(
    selectInviteAllClientEmailDomain,
    substate => substate.DataById,
  );

const makeSelectInviteClientEmailSuccess = () =>
  createSelector(
    selectInviteAllClientEmailDomain,
    substate => substate.response,
  );
const makeSelectInviteAllClientEmailSuccess = () =>
  createSelector(
    selectInviteAllClientEmailDomain,
    substate => substate.success,
  );

export {
  makeSelectInviteClientEmailInfoSuccess,
  makeSelectInviteAllClientEmail,
  makeSelectInviteClientEmailSuccess,
  makeSelectInviteAllClientEmailSuccess,
};
