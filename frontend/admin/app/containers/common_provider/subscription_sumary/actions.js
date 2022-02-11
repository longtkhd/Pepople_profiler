/*
 *
 * SubscriptionSumary actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SUBSCRIPTION,
  GET_SUBSCRIPTION_SUCCESS,
  GET_SUBSCRIPTION_ERROR
} from './constants';

import { getSubscriptionInfo } from 'services/api/agencyService'

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

function subscriptionAction() {
  return {
    type: GET_SUBSCRIPTION
  }
}

function subscriptionSuccess(payload) {
  return {
    type: GET_SUBSCRIPTION_SUCCESS,
    payload
  }
}

function subscriptionError(error) {
  return {
    type: GET_SUBSCRIPTION_ERROR,
    error
  }
}

export default (agencyId) => {
  return async dispatch => {
    try {
      dispatch(subscriptionAction());
      const res = await getSubscriptionInfo(agencyId);
      dispatch(subscriptionSuccess(res.data))

    } catch (e) {
      dispatch(subscriptionError(e.response?.data))

    }
  }
}
