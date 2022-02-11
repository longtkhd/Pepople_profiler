/*
 *
 * ClientJobDashboard actions
 *
 */

import {
  GET_DASHBOARD_DETAIL,
  GET_DASHBOARD_DETAIL_SUCCESS,
  GET_DASHBOARD_DETAIL_ERROR,
} from './constants';

import { getClientJobDashBoardDetailService } from 'services/api/clientJobReportSevice';

function getClientJobDashboard() {
  return {
    type: GET_DASHBOARD_DETAIL,
  };
}

function getClientJobDashboardSuccess(payload) {
  return {
    type: GET_DASHBOARD_DETAIL_SUCCESS,
    payload,
  };
}

function getClientJobDashboardError(error) {
  return {
    type: GET_DASHBOARD_DETAIL_ERROR,
    error,
  };
}

export function getClientJobDashboardAction(inviteToken) {
  return async dispatch => {
    try {
      dispatch(getClientJobDashboard());
      const response = await getClientJobDashBoardDetailService(inviteToken);
      if(response?.data?.success){
        dispatch(getClientJobDashboardSuccess(response?.data));
      }else {
        dispatch(getClientJobDashboardError(response?.data?.error));
      }
    } catch (error) {
      dispatch(getClientJobDashboardError(error?.message));
    }
  };
}
