import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inviteClientEmail state domain
 */

const selectInviteClientEmailDomain = state =>
  state.inviteClientEmail || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by InviteClientEmail
 */

const makeSelectInviteClientEmail = () =>
  createSelector(
    selectInviteClientEmailDomain,
    substate => substate,
  );

const makeSelectInviteClientEmailSuccess = () =>
  createSelector(
    selectInviteClientEmailDomain,
    substate => substate.response,
  );

const makeSelectInviteClientEmailInfoSuccess = () =>
  createSelector(
    selectInviteClientEmailDomain,
    substate => substate.DataById,
  );

  const makeSelectAddEmailTemplateSuccess = () =>
  createSelector(
    selectInviteClientEmailDomain,
    substate => substate.success,
    );
  
    const makeSelectAddEmailTemplateError = () =>
  createSelector(
    selectInviteClientEmailDomain,
    substate => substate.error,
  );





export {
  makeSelectInviteClientEmail,
  makeSelectInviteClientEmailSuccess,
  makeSelectInviteClientEmailInfoSuccess,
  makeSelectAddEmailTemplateSuccess,
  makeSelectAddEmailTemplateError

};
