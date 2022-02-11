/*
 *
 * ClientJobDashboard reducer
 *
 */
import produce from 'immer';
import {
  GET_DASHBOARD_DETAIL,
  GET_DASHBOARD_DETAIL_ERROR,
  GET_DASHBOARD_DETAIL_SUCCESS,
} from './constants';

export const initialState = {
  dashboardLoading: false,
  dashboardDetail: null,
  dashboardError: null,
};

/* eslint-disable default-case, no-param-reassign */
const clientJobDashboardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_DASHBOARD_DETAIL:
        draft.dashboardLoading = true;
        draft.dashboardDetail = null;
        draft.dashboardError = null;
        break;
      case GET_DASHBOARD_DETAIL_SUCCESS:
        draft.dashboardLoading = false;
        draft.dashboardDetail = action.payload.data;
        draft.dashboardError = null;
        break;
      case GET_DASHBOARD_DETAIL_ERROR:
        draft.dashboardLoading = false;
        draft.dashboardDetail = null;
        draft.dashboardError = action.error;
        break;
      default:
        break;
    }
  });

export default clientJobDashboardReducer;
