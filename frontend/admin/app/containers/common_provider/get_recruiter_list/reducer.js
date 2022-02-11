/*
 *
 * Get user info reducer
 *
 */
import produce from 'immer';
import {
  GET_RECRUITER_LIST,
  GET_RECRUITER_LIST_SUCCESS,
  GET_RECRUITER_LIST_ERROR,
  GET_RECRUITER_LIST_BY_ADMIN,
  GET_RECRUITER_LIST_BY_ADMIN_SUCCESS,
  GET_RECRUITER_LIST_BY_ADMIN_ERROR
} from './constants';

export const initialState = {
  error: null,
  loading: false,
  recruiterListResponse: null,
  recruiterList: null
};

/* eslint-disable default-case, no-param-reassign */
const getRecruiterListReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_RECRUITER_LIST:
        draft.error = null;
        draft.loading = true;
        draft.recruiterListResponse = null;
        break;
      case GET_RECRUITER_LIST_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.recruiterListResponse = action.response;
        break;
      case GET_RECRUITER_LIST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.recruiterListResponse = null;
        break;
      case GET_RECRUITER_LIST_BY_ADMIN:
        draft.error = null;
        draft.loading = true;
        draft.recruiterList = null;
        break;
      case GET_RECRUITER_LIST_BY_ADMIN_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.recruiterList = action.payload.data;
        break;
      case GET_RECRUITER_LIST_BY_ADMIN_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.recruiterList = null;
        break;
      default:
        break;
    }
  });

export default getRecruiterListReducer;
