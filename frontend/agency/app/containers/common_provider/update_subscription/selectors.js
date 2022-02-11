import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update subscription state domain
 */

const selectUpdateSubscriptionDomain = state => state.updateSubscription || initialState;

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

const makeSelectPaymentUpdateSuccess = () =>
  createSelector(
    selectUpdateSubscriptionDomain,
    substate => substate.paymentSuccess,
  );

const makeSelectPaymentUpdateError = () =>
  createSelector(
    selectUpdateSubscriptionDomain,
    substate => substate.paymentError,
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
  makeSelectShowDowngradeNoti,
  makeSelectPaymentUpdateError,
  makeSelectPaymentUpdateSuccess
};
