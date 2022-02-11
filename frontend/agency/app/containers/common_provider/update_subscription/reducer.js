/*
 *
 * Update subscription reducer
 *
 */
import produce from 'immer';
import {
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_SUCCESS,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_DOWNGRADE_NOTI,
  RESET_STATE, PAYMENT_UPDATE, PAYMENT_UPDATE_SUCCESS, PAYMENT_UPDATE_ERROR,
} from './constants'

export const initialState = {
  loading: false,
  error: null,
  response: null,
  isShowDowngradeNoti: false,
  paymentSuccess: null,
  paymentError: null,
};

/* eslint-disable default-case, no-param-reassign */
const updateSubscriptionReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_SUBSCRIPTION:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        draft.isShowDowngradeNoti = false;
        break;
      case UPDATE_SUBSCRIPTION_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.isShowDowngradeNoti = false;
        draft.response = action.payload
        break;
      case UPDATE_SUBSCRIPTION_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      case SHOW_DOWNGRADE_NOTI:
        draft.error = null;
        draft.loading = false;
        draft.response = null;
        draft.isShowDowngradeNoti = action.payload;
        break;
      case PAYMENT_UPDATE:
        draft.loading = true;
        draft.paymentSuccess = null;
        draft.paymentError = null;
        break;
      case PAYMENT_UPDATE_SUCCESS:
        draft.loading = false;
        draft.paymentSuccess = action.payload.data;
        draft.paymentError = null;
        break;
      case PAYMENT_UPDATE_ERROR:
        draft.loading = false;
        draft.paymentSuccess = null;
        draft.paymentError = { message: 'Payment unsuccessfully' };
        break;
      case RESET_STATE:
        draft.error = null;
        draft.loading = false;
        draft.response = null;
        draft.isShowDowngradeNoti = null;
        draft.paymentSuccess = null;
        draft.paymentError = null;
        break;
      default:
        break;
    }
  });

export default updateSubscriptionReducer;
