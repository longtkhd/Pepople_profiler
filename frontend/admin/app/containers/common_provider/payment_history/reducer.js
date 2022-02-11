/*
 *
 * PaymentHistoryInfo reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_ERROR
} from './constants';

export const initialState = {
  loading: null,
  response: null,
  error: null
};

/* eslint-disable default-case, no-param-reassign */
const paymentHistoryInfoReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_PAYMENT_HISTORY:
        draft.loading = true;
        draft.response = null;
        draft.error = null;
        break;
      case GET_PAYMENT_HISTORY_SUCCESS:
        draft.loading = null;
        draft.response = action.payload.data;
        draft.error = null;
        break;
      case GET_PAYMENT_HISTORY_ERROR:
        draft.loading = null;
        draft.response = null;
        draft.error = action.error;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default paymentHistoryInfoReducer;
