/*
 *
 * SubscriptionInfo reducer
 *
 */
import produce from 'immer';
import {
  GET_SUBSCRIPTION_INFO,
  GET_SUBSCRIPTION_INFO_SUCCESS,
  GET_SUBSCRIPTION_INFO_ERROR,
  CANCEL_SUBSCRIPTION_INFO,
  CANCEL_SUBSCRIPTION_INFO_ERROR,
  CANCEL_SUBSCRIPTION_INFO_SUCCESS,
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_HISTORY_SUCCSEE,
  GET_PAYMENT_HISTORY_ERROR,
  CLEAR_SUBSCRIPTION_INFO,
  CLEAR_PAYMENT_HISTORY,
} from './constants';

export const initialState = {
  loadingSub: false,
  errorSub: null,
  subscriptionInfo: null,
  loadingPayment: false,
  errorPayment: null,
  paymentHistoryData: null,
};

/* eslint-disable default-case, no-param-reassign */
const subscriptionInfoReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_SUBSCRIPTION_INFO:
        draft.errorSub = null;
        draft.loadingSub = true;
        draft.subscriptionInfo = null;
        break;
      case GET_SUBSCRIPTION_INFO_SUCCESS:
        draft.errorSub = null;
        draft.loadingSub = false;
        draft.subscriptionInfo = action.payload.data;
        break;
      case GET_SUBSCRIPTION_INFO_ERROR:
        draft.errorSub = action.error;
        draft.loadingSub = false;
        draft.subscriptionInfo = null;
        break;

      case GET_PAYMENT_HISTORY:
        draft.loadingPayment = true;
        draft.errorPayment = null;
        draft.paymentHistoryData = null;
        break;
      case GET_PAYMENT_HISTORY_SUCCSEE:
        draft.loadingPayment = false;
        draft.errorPayment = null;
        draft.paymentHistoryData = action.payload.data;
        break;
      case GET_PAYMENT_HISTORY_ERROR:
        draft.loadingPayment = false;
        draft.errorPayment = action.error;
        draft.paymentHistoryData = null;
        break;

      case CANCEL_SUBSCRIPTION_INFO:
        draft.errorSub = null;
        draft.loadingSub = true;
        break;
      case CANCEL_SUBSCRIPTION_INFO_SUCCESS:
        draft.errorSub = null;
        draft.loadingSub = false;
        draft.subscriptionInfo = null;
        break;
      case CANCEL_SUBSCRIPTION_INFO_ERROR:
        draft.errorSub = action.error;
        draft.loadingSub = false;
        break;
      case CLEAR_SUBSCRIPTION_INFO:
        draft.errorSub = null;
        draft.loadingSub = false;
        draft.subscriptionInfo = null;
        break;
      case CLEAR_PAYMENT_HISTORY:
        draft.errorPayment = null;
        draft.loadingPayment = false;
        draft.paymentHistoryData = null;
        break;
      default:
        break;
    }
  });

export default subscriptionInfoReducer;
