/*
 *
 * Get user info reducer
 *
 */
import produce from 'immer';
import {
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  userInfo: null,
};

/* eslint-disable default-case, no-param-reassign */
const getUserInfoReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_USER_INFO:
        draft.error = null;
        draft.loading = true;
        draft.userInfo = null;
        break;
      case GET_USER_INFO_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.userInfo = action.payload.data;
        break;
      case GET_USER_INFO_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.userInfo = null;
        break;
      default:
        break;
    }
  });

export default getUserInfoReducer;
