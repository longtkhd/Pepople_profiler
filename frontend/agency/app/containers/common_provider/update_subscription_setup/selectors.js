import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update subscription state domain
 */

const selectUpdateSubscriptionDomain = state => state.updateSubscriptionSetup || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Subscription
 */

const makeSelectUpdateSubscriptionLoading = () =>
  createSelector(
    selectUpdateSubscriptionDomain,
    substate => substate.loading,
  );

const makeSelectUpdateSubscriptionError = () =>
  createSelector(
    selectUpdateSubscriptionDomain,
    substate => substate.error,
  );

const makeSelectUpdateSubscriptionResponse = () =>
  createSelector(
    selectUpdateSubscriptionDomain,
    substate => substate.response,
  );

const makeSelectShowDowngradeNoti = () =>
  createSelector(
    selectUpdateSubscriptionDomain,
    substate => substate.isShowDowngradeNoti,
  );

export { 
  makeSelectUpdateSubscriptionLoading,
  makeSelectUpdateSubscriptionError,
  makeSelectUpdateSubscriptionResponse,
  makeSelectShowDowngradeNoti
};
