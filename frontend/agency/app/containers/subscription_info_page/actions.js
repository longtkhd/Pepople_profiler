/*
 *
 * SubscriptionInfo actions
 *
 */

import {
  GET_SUBSCRIPTION_INFO,
  GET_SUBSCRIPTION_INFO_SUCCESS,
  GET_SUBSCRIPTION_INFO_ERROR,
  CANCEL_SUBSCRIPTION_INFO,
  CANCEL_SUBSCRIPTION_INFO_SUCCESS,
  CANCEL_SUBSCRIPTION_INFO_ERROR,
  GET_PAYMENT_HISTORY,
  GET_PAYMENT_HISTORY_SUCCSEE,
  GET_PAYMENT_HISTORY_ERROR,
  CLEAR_SUBSCRIPTION_INFO,
  CLEAR_PAYMENT_HISTORY
} from './constants';

import {
  getSubscriptionInfo,
  getPaymentHistories,
  cancelSubscriptionInfo,
} from 'services/api/agencyService';

function getSubscriptionInfoAction() {
  return {
    type: GET_SUBSCRIPTION_INFO,
  };
}

function getSubscriptionInfoSuccess(payload) {
  return {
    type: GET_SUBSCRIPTION_INFO_SUCCESS,
    payload,
  };
}

function getSubscriptionInfoError(error) {
  return {
    type: GET_SUBSCRIPTION_INFO_ERROR,
    error,
  };
}

function cancelSubscriptionInfoAction() {
  return {
    type: CANCEL_SUBSCRIPTION_INFO,
  };
}

function cancelSubscriptionInfoSuccess(payload) {
  return {
    type: CANCEL_SUBSCRIPTION_INFO_SUCCESS,
    payload,
  };
}

function cancelSubscriptionInfoError(error) {
  return {
    type: CANCEL_SUBSCRIPTION_INFO_ERROR,
    error,
  };
}

function getPaymentHistoryAction() {
  return {
    type: GET_PAYMENT_HISTORY,
  };
}

function getPaymentHistorySuccess(payload) {
  return {
    type: GET_PAYMENT_HISTORY_SUCCSEE,
    payload,
  };
}

function getPaymentHistoryError(error) {
  return {
    type: GET_PAYMENT_HISTORY_ERROR,
    error,
  };
}

export function clearSubscriptionInfoAction() {
  return {
    type: CLEAR_SUBSCRIPTION_INFO,
  };
}

export function clearPaymentHistoryAction() {
  return {
    type: CLEAR_PAYMENT_HISTORY,
  };
}

export function getSubscription(agencyId) {
  return async dispatch => {
    try {
      dispatch(getSubscriptionInfoAction());
      const response = await getSubscriptionInfo(agencyId);
      dispatch(getSubscriptionInfoSuccess(response.data));
    } catch (error) {
      dispatch(getSubscriptionInfoError(error.response?.data));
    }
  };
}

export function getPaymentHistory(agencyId, params) {
  return async dispatch => {
    try {
      dispatch(getPaymentHistoryAction());
      const response = await getPaymentHistories(agencyId, params);
      if(response?.data){
          dispatch(getPaymentHistorySuccess(response.data));
      }else{
        dispatch(getPaymentHistoryError(response?.error));
      }
    } catch (error) {
      dispatch(getPaymentHistoryError(error?.response?.error));
    }
  }
}

export function cancelSubscription(agencyId) {
  return async dispatch => {
    try {
      dispatch(cancelSubscriptionInfoAction());
      const response = await cancelSubscriptionInfo(agencyId);
      dispatch(cancelSubscriptionInfoSuccess(response.data));
    } catch (error) {
      dispatch(cancelSubscriptionInfoError(error.response?.data));
    }
  };
}
