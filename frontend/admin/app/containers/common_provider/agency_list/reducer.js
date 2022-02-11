/*
 *
 * Create password reducer
 *
 */
import produce from 'immer';
import {
  GET_ARGENCY_LIST,
  GET_ARGENCY_LIST_SUCCESS,
  GET_ARGENCY_LIST_FAILED,
  CLEAN_ARGENCY_LIST,
  GET_ARGENCY_LIST_ID,
  GET_ARGENCY_LIST_ID_SUCCESS,
  GET_ARGENCY_LIST_ID_FAILED,
  DELETE_AGENCY,
  DELETE_AGENCY_SUCCESS,
  DELETE_AGENCY_ERROR,
  DEACTIVE_AGENCY,
  DEACTIVE_AGENCY_SUCCESS,
  DEACTIVE_AGENCY_ERROR,
  RESET_STATE,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  success: null,
  argencyData: null,
  agencyById: null,
  deleteStatus: null,
  deactiveStatus: null,
  deactiveError: null,
};

/* eslint-disable default-case, no-param-reassign */
const getArgencyReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_ARGENCY_LIST:
        draft.error = null;
        draft.loading = true;
        draft.success = false;
        break;
      case GET_ARGENCY_LIST_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.success = true;
        draft.argencyData = action.payload.data;
        break;
      case GET_ARGENCY_LIST_FAILED:
        draft.error = action.error;
        draft.loading = false;
        draft.success = false;
        break;
      case GET_ARGENCY_LIST_ID:
        draft.error = null;
        draft.loading = true;
        draft.success = false;
        break;
      case GET_ARGENCY_LIST_ID_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.success = true;
        draft.agencyById = action.payload.data;
        break;
      case GET_ARGENCY_LIST_ID_FAILED:
        draft.error = action.error;
        draft.loading = false;
        draft.success = false;
        break;
      case CLEAN_ARGENCY_LIST:
        draft.error = null;
        draft.loading = false;
        draft.success = null;
        break;
      case DELETE_AGENCY:
        draft.loading = true;
        draft.deleteStatus = null;
        draft.error = null;
        break;
      case DELETE_AGENCY_SUCCESS:
        draft.loading = null;
        draft.deleteStatus = action.payload?.data?.success;
        draft.error = null;
        break;
      case DELETE_AGENCY_ERROR:
        draft.loading = null;
        draft.deleteStatus = null;
        draft.error = action.error;
        break;
      case DEACTIVE_AGENCY:
        draft.loading = true;
        draft.deactiveStatus = null;
        draft.error = null;
        break;
      case DEACTIVE_AGENCY_SUCCESS:
        draft.loading = null;
        draft.deactiveStatus = action.payload?.data?.success;
        draft.error = null;
        break;
      case DEACTIVE_AGENCY_ERROR:
        draft.loading = null;
        draft.deactiveStatus = null;
        draft.deactiveError = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.deleteStatus = null;
        draft.error = null;
        break;
      default:
        break;
    }
  });

export default getArgencyReducer;
