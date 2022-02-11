import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterInvite state domain
 */

const selectRecruiterInviteDomain = state =>
  state.recruiterInvite || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterInvite
 */

const makeSelectRecruiterInviteList = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.recruiterList,
  );

const makeSelectRecruiterInviteLoad = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.loading,
  );

const makeSelectRecruiterInviteMessage = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.message,
  );

const makeSelectRecruiterInviteError = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.error,
  );

const makeSelectChargesInviteLoading = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.chargesLoading,
  );

const makeSelectChargesInviteSuccess = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.chargesInvite,
  );

const makeSelectChargesInviteError = () =>
  createSelector(
    selectRecruiterInviteDomain,
    substate => substate?.chargesError,
  );

export {
  makeSelectRecruiterInviteList,
  makeSelectRecruiterInviteLoad,
  makeSelectRecruiterInviteMessage,
  makeSelectChargesInviteLoading,
  makeSelectChargesInviteError,
  makeSelectChargesInviteSuccess,
  makeSelectRecruiterInviteError
};
