import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterListPage state domain
 */

const selectRecruiterListPageDomain = state =>
  state.recruiterListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterListPage
 */

const makeSelectGetRecruiterLoading = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.loading,
  );

const makeSelectGetRecruiterError = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.error,
  );

const makeSelectRecruiterData = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.recruiterData,
  );

const makeSelectSubscriptionInfo = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.subscriptionInfo,
  );

const makeSelectReInviteRecruiterLoading = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.reInviteLoading,
  )

const makeSelectReInviteRecruiterError = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.reInviteError,
  )

const makeSelectReInviteRecruiterResponse = () =>
  createSelector(
    selectRecruiterListPageDomain,
    substate => substate.reInviteResponse,
  )

export {
  makeSelectGetRecruiterLoading,
  makeSelectGetRecruiterError,
  makeSelectRecruiterData,
  makeSelectSubscriptionInfo,
  makeSelectReInviteRecruiterLoading,
  makeSelectReInviteRecruiterError,
  makeSelectReInviteRecruiterResponse,
};
