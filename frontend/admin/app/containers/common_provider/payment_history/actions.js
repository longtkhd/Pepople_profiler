/*
 *
 * PaymentHistoryInfo actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_HISTORY_SUCCESS,
  GET_PAYMENT_HISTORY_ERROR
} from './constants';
import { getPaymentHistories } from 'services/api/agencyService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
function getPaymentHistoryAction() {
  return {
    type: GET_PAYMENT_HISTORY
  }
}
function getPaymentHistorySuccess(payload) {
  return {
    type: GET_PAYMENT_HISTORY_SUCCESS,
    payload
  }
}

function getPaymentHistoryError(error) {
  return {
    type: GET_PAYMENT_HISTORY_ERROR,
    error

  }
}

export default (agencyId) => {
  return async dispatch => {
    try {
      dispatch(getPaymentHistoryAction())
      const res = await getPaymentHistories(agencyId)
      dispatch(getPaymentHistorySuccess(res.data))

    } catch (e) {
      dispatch(getPaymentHistoryError(e.response?.data))
    }
  }
}


