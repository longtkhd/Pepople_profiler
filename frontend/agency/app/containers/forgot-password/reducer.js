/*
 *
 * ForgotPassword reducer
 *
 */
import produce from 'immer';
import { SEND_EMAIL, SEND_EMAIL_SUCCESS, SEND_EMAIL_FAILED } from './constants';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  response: null,
  error: null,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const forgotPasswordReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SEND_EMAIL:
        draft.loading = true;
        draft.error = null;
        draft.response = null;
        break;
      case SEND_EMAIL_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.response = action.response;
        break;
      case SEND_EMAIL_FAILED:
        draft.loading = false;
        draft.error = action.error;
        draft.response = null;
        break;
      case LOCATION_CHANGE:
        draft.loading = false;
        draft.error = null;
        draft.response = null;
      default:
        break;
    }
  });

export default forgotPasswordReducer;
