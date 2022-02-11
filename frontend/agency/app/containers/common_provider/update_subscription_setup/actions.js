/*
 *
 * Update subscription actions
 *
 */

import {
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_SUCCESS,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_DOWNGRADE_NOTI,
} from './constants';
import { updateSubscriptionSetup } from 'services/api/agencyService';

export default (accessToken, agencyId, data) => {
  return async dispatch => {
    try {
      dispatch(updateSubscription());
      const response = await updateSubscriptionSetup(accessToken, agencyId, data);
      if (response?.data?.success) {
        if (response.data?.data?.isShowDowngradeNoti) {
          dispatch(showDowngradeNoti(response.data?.data?.isShowDowngradeNoti));
          dispatch(resetState())
        } else {
          dispatch(updateSubscriptionSuccess(response.data));
          dispatch(resetState())
        }
      } else {
        dispatch(updateSubscriptionError(response?.data?.error));
      }
    } catch (err) {
      dispatch(updateSubscriptionError(err.response?.data));
    }
  };
};

function updateSubscription() {
  return {
    type: UPDATE_SUBSCRIPTION
  };
}

function updateSubscriptionSuccess(payload) {
  return {
    type: UPDATE_SUBSCRIPTION_SUCCESS,
    payload
  };
}

function updateSubscriptionError(error) {
  return {
    type: UPDATE_SUBSCRIPTION_ERROR,
    error
  };
}

function showDowngradeNoti(payload) {
  return {
    type: SHOW_DOWNGRADE_NOTI,
    payload
  }
}

function resetState() {
  return {
    type: RESET_STATE
  }
}

export function setUpdateSubscriptionDone() {
  return dispatch => dispatch(updateSubscriptionAction());
}
