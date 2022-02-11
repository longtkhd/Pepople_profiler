/*
 *
 * DashboardPage reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_USER_COUNT,
  GET_USER_COUNT_SUCCESS,
  GET_USER_COUNT_ERROR,
  GET_COUNT_PARSING,
  GET_COUNT_PARSING_SUCCESS,
  GET_COUNT_PARSING_ERROR,
  GET_COUNT_ASSESSMENT,
  GET_COUNT_ASSESSMENT_SUCCESS,
  GET_COUNT_ASSESSMENT_ERROR,
  GET_COUNT_SUBSCRIPTION,
  GET_COUNT_SUBSCRIPTION_SUCCESS,
  GET_COUNT_SUBSCRIPTION_ERROR
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  userCount: null,
  dataParsing: null,
  dataAssessment: null,
  dataSubscription: null

};

/* eslint-disable default-case, no-param-reassign */
const dashboardPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_USER_COUNT:
        draft.error = null;
        draft.loading = true;
        draft.userCount = null;
        break;
      case GET_USER_COUNT_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.userCount = action.payload.data;
        break;
      case GET_USER_COUNT_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.userCount = null;
        break;
      case GET_COUNT_PARSING:
        draft.error = null;
        draft.loading = true;
        draft.userCount = null;
        break;
      case GET_COUNT_PARSING_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.dataParsing = action.payload.data;
        break;
      case GET_COUNT_PARSING_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.userCount = null;
        break;
      case GET_COUNT_ASSESSMENT:
        draft.error = null;
        draft.loading = true;
        draft.dataAssessment = null;
        break;
      case GET_COUNT_ASSESSMENT_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.dataAssessment = action.payload.data;
        break;
      case GET_COUNT_ASSESSMENT_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.dataAssessment = null;
        break;
      case GET_COUNT_SUBSCRIPTION:
        draft.error = null;
        draft.loading = true;
        draft.dataSubscription = null;
        break;
      case GET_COUNT_SUBSCRIPTION_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.dataSubscription = action.payload.data;
        break;
      case GET_COUNT_SUBSCRIPTION_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.dataSubscription = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default dashboardPageReducer;
