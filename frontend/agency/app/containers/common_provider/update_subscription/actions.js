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
  PAYMENT_UPDATE,
  PAYMENT_UPDATE_ERROR,
  PAYMENT_UPDATE_SUCCESS,
  RESET_STATE
} from './constants';
import { updateSubscription, paymentUpdatePlanService } from 'services/api/agencyService';

export default (agencyId, data) => {
  return async dispatch => {
    try {
      dispatch(updateSubscriptionAction());
      const response = await updateSubscription(agencyId, data);
      if (response && response.data?.success) {
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

export function paymentUpdatePlanAction(agencyId, data){
    return async dispatch => {
      try {
        dispatch(paymentUpdatePlan())
        const response = await paymentUpdatePlanService(agencyId, data);
        if (response && response.data?.success) {
          dispatch(paymentUpdatePlanSuccess(response?.data));
        } else {
          dispatch(paymentUpdatePlanError(response?.data?.error));
        }
      }catch (e) {
        dispatch(paymentUpdatePlanError(err.response?.data));
      }
    }
}

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

function paymentUpdatePlan() {
  return {
    type: PAYMENT_UPDATE
  };
}

function paymentUpdatePlanSuccess(payload) {
  return {
    type: PAYMENT_UPDATE_SUCCESS,
    payload
  };
}

function paymentUpdatePlanError(error) {
  return {
    type: PAYMENT_UPDATE_ERROR,
    error
  };
}

function showDowngradeNoti(payload) {
  return {
    type: SHOW_DOWNGRADE_NOTI,
    payload
  }
}

export function resetState() {
  return {
    type: RESET_STATE
  }
}

export function setUpdateSubscriptionDone() {
  return dispatch => dispatch(updateSubscriptionAction());
}
