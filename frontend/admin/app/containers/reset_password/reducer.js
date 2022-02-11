/*
 *
 * ResetPassword reducer
 *
 */
import produce from 'immer';
import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED,
  CHECK_TOKEN,
  CHECK_TOKEN_ERROR,
  CHECK_TOKEN_SUCCESS,
} from './constants';

export const initialState = {
  checkTokenLoading: false,
  checkTokenError: null,
  checkTokenResponse: null,
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordResponse: null,
};


/* eslint-disable default-case, no-param-reassign */
const resetPasswordReducer = (state = initialState, action) =>
  produce(state, ( draft ) => {
    switch (action.type) {
     case RESET_PASSWORD:
        draft.resetPasswordLoading = true,
        draft.resetPasswordError = null;
        draft.resetPasswordResponse = null;
        break;
      case RESET_PASSWORD_SUCCESS:
        draft.resetPasswordLoading = false;
        draft.resetPasswordError = null;
        draft.resetPasswordResponse = action.response;
        break;
      case RESET_PASSWORD_FAILED:
        draft.resetPasswordLoading = false,
        draft.resetPasswordError = action.error;
        draft.resetPasswordResponse = null;
        break;
      case CHECK_TOKEN:
        draft.checkTokenLoading = true;
        draft.checkTokenError = null;
        draft.checkTokenResponse = null;
        break;
      case CHECK_TOKEN_SUCCESS:
        draft.checkTokenLoading = false;
        draft.checkTokenError = null;
        draft.checkTokenResponse = action.response;
        break;
      case CHECK_TOKEN_ERROR:
        draft.checkTokenLoading = false;
        draft.checkTokenError = action.error;
        draft.checkTokenResponse = null;
        break;
      default:
        break;
    }
  });

export default resetPasswordReducer;
