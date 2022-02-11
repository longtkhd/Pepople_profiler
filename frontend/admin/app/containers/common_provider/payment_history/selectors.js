import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the paymentHistoryInfo state domain
 */

const selectPaymentHistoryInfoDomain = state =>
  state.paymentHistoryInfoState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PaymentHistoryInfo
 */

const makeSelectPaymentHistoryInfo = () =>
  createSelector(
    selectPaymentHistoryInfoDomain,
    substate => substate,
  );

const makeSelectPaymentHistoryResponse = () =>
  createSelector(
    selectPaymentHistoryInfoDomain,
    substate => substate.response,
  );

export {
  makeSelectPaymentHistoryInfo,
  makeSelectPaymentHistoryResponse

};
