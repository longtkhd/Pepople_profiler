/*
 *
 * LoginPage reducer
 *
 */
import produce from 'immer';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  CLEAR_USER_DATA,
} from './constants';

export const initialState = {
  userData: null,
  loading: false,
  error: null,
};

/* eslint-disable default-case, no-param-reassign */
const loginPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOGIN:
        draft.loading = true;
        draft.error = false;
        draft.userData = null;
        break;
      case LOGIN_SUCCESS:
        draft.loading = false;
        draft.error = false;
        draft.userData = action.response;
        break;
      case LOGIN_ERROR:
        draft.loading = false;
        draft.error = action.error;
        draft.userData = null;
        break;
      case CLEAR_USER_DATA:
        draft.loading = false;
        draft.error = null;
        draft.userData = null;
      default:
        break;
    }
  });

export default loginPageReducer;
