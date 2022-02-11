/*
 *
 * RecruiterListPage reducer
 *
 */
import produce from 'immer';
import { 
  GET_RECRUITER,
  GET_RECRUITER_SUCCESS,
  GET_RECRUITER_ERROR,
  GET_SUBSCRIPTION_INFO,
  GET_SUBSCRIPTION_INFO_SUCCESS,
  GET_SUBSCRIPTION_INFO_ERROR,
  RE_INVITE_RECRUITER_REQUEST,
  RE_INVITE_RECRUITER_SUCCESS,
  RE_INVITE_RECRUITER_ERROR,
} from './constants';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  loading: false,
  error: null,
  recruiterData: null,
  subscriptionInfo: null,
  reInviteLoading: false,
  reInviteError: null,
  reInviteResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const recruiterReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_RECRUITER:
        draft.error = null;
        draft.loading = true;
        draft.recruiterData = null;
        break;
      case GET_RECRUITER_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.recruiterData = action.payload.data;
        break;
      case GET_RECRUITER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.recruiterData = null;
        break;
      case RE_INVITE_RECRUITER_REQUEST:
        draft.reInviteLoading = true;
        draft.reInviteError = null;
        draft.reInviteResponse = null;
        break;
      case RE_INVITE_RECRUITER_SUCCESS:
        draft.reInviteLoading = false;
        draft.reInviteError = null;
        draft.reInviteResponse = action.response;
        break;
      case RE_INVITE_RECRUITER_ERROR:
        draft.reInviteLoading = false;
        draft.reInviteError = action.error;
        draft.reInviteResponse = null;
        break;
      case GET_SUBSCRIPTION_INFO:
        draft.error = null;
        draft.loading = true;
        draft.subscriptionInfo = null;
        break;
      case GET_SUBSCRIPTION_INFO_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.subscriptionInfo = action.payload.data;
        break;
      case GET_SUBSCRIPTION_INFO_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.subscriptionInfo = null;
        break;
      case LOCATION_CHANGE:
        draft.error = null;
        draft.loading = false;
        draft.subscriptionInfo = null;
        draft.recruiterData = null;
        draft.reInviteLoading = false;
        draft.reInviteError = null;
        draft.reInviteResponse = null;
        break;
      default:
        break;
    }
  });

export default recruiterReducer;
