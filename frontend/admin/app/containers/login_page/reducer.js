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
        draft.error = false;
        draft.userData = action.response;
        draft.loading = false;
        draft.loggedIn = true;
        break;
      case LOGIN_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.userData = null;
        break;
      case CLEAR_USER_DATA:
        draft.userData = null;
        draft.error = null;
      default:
        break;
    }
  });

export default loginPageReducer;
