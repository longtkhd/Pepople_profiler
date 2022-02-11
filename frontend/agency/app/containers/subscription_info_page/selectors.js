import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the subscriptionInfo state domain
 */

const selectSubscriptionInfoDomain = state =>
  state.subscriptionInfoPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SubscriptionInfo
 */

const makeSelectGetSubscriptionInfoLoading = () =>
  createSelector(
    selectSubscriptionInfoDomain,
    substate => substate.loadingSub,
  );

const makeSelectGetSubscriptionInfoError = () =>
  createSelector(
    selectSubscriptionInfoDomain,
    substate => substate.errorSub,
  );

const makeSelectSubscriptionInfo = () =>
  createSelector(
    selectSubscriptionInfoDomain,
    substate => substate.subscriptionInfo,
  );

const makeSelectGetPaymentHistoryLoading = () =>
  createSelector(
    selectSubscriptionInfoDomain,
    substate => substate.loadingPayment,
  );
const makeSelectGetPaymentHistoryResponse = () =>
  createSelector(
    selectSubscriptionInfoDomain,
    substate => substate.paymentHistoryData,
  );
const makeSelectGetPaymentHistoryError = () =>
  createSelector(
    selectSubscriptionInfoDomain,
    substate => substate.errorPayment,
  );

export {
  makeSelectSubscriptionInfo,
  makeSelectGetSubscriptionInfoLoading,
  makeSelectGetSubscriptionInfoError,
  makeSelectGetPaymentHistoryLoading,
  makeSelectGetPaymentHistoryResponse,
  makeSelectGetPaymentHistoryError
};
