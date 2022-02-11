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
import { updateSubscription } from 'services/api/agencyService';

export default (agencyId, data) => {
  return async dispatch => {
    try {
      dispatch(updateSubscriptionAction());
      const response = await updateSubscription(agencyId, data);
      if (response && response.data?.success) {
        if (response.data?.data?.isShowDowngradeNoti) {
          dispatch(showDowngradeNoti(response.data?.data?.isShowDowngradeNoti));
        } else {
          dispatch(updateSubscriptionSuccess(response.data));
        }
      } else {
        dispatch(updateSubscriptionError(response?.data?.error));
      }
    } catch (err) {
      dispatch(updateSubscriptionError(err.response?.data));
    }
  };
};

function updateSubscriptionAction() {
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

export function setUpdateSubscriptionDone() {
  return dispatch => dispatch(updateSubscriptionAction());
}
