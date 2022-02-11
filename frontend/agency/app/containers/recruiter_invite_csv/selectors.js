import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterInviteCsv state domain
 */

const selectRecruiterInviteCsvDomain = state =>
  state.recruiterInviteCsv || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterInviteCsv
 */

const makeSelectRecruiterInviteCsv = () =>
  createSelector(
    selectRecruiterInviteCsvDomain,
    substate => substate,
  );
const makeSelectRecruiterInviteCsvError = () =>
  createSelector(
    selectRecruiterInviteCsvDomain,
    substate => substate?.error,
  );

const makeSelectChargesInviteLoading = () =>
  createSelector(
    selectRecruiterInviteCsvDomain,
    substate => substate?.chargesLoading,
  );

const makeSelectChargesInviteSuccess = () =>
  createSelector(
    selectRecruiterInviteCsvDomain,
    substate => substate?.chargesInvite,
  );

const makeSelectChargesInviteError = () =>
  createSelector(
    selectRecruiterInviteCsvDomain,
    substate => substate?.chargesError,
  );

const makeSelectInviteSuccess = () =>
  createSelector(
    selectRecruiterInviteCsvDomain,
    substate => substate?.invitedSuccess,
  );



export {
  selectRecruiterInviteCsvDomain,
  makeSelectRecruiterInviteCsvError,
  makeSelectRecruiterInviteCsv,
  makeSelectChargesInviteSuccess,
  makeSelectChargesInviteError,
  makeSelectChargesInviteLoading,
  makeSelectInviteSuccess
};
