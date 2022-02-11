import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectChargesInviteDomain = state =>
  state.chargesInvite || initialState;

const makeSelectChargesInviteLoading = () =>
  createSelector(
    selectChargesInviteDomain,
    substate => substate?.chargesLoading,
  );

const makeSelectChargesInviteSuccess = () =>
  createSelector(
    selectChargesInviteDomain,
    substate => substate?.chargesInvite,
  );

const makeSelectChargesInviteError = () =>
  createSelector(
    selectChargesInviteDomain,
    substate => substate?.chargesError,
  );

export {
  makeSelectChargesInviteLoading,
  makeSelectChargesInviteError,
  makeSelectChargesInviteSuccess,
};
