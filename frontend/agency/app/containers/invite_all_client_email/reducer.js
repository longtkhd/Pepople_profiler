/*
 *
 * InviteAllClientEmail reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_MAIL_TEMPLATE_USER,
  GET_MAIL_TEMPLATE_USER_SUCCESS,
  GET_MAIL_TEMPLATE_USER_ERROR,
  GET_MAIL_TEMPLATE_USER_BY_ID,
  GET_MAIL_TEMPLATE_USER_BY_ID_SUCCESS,
  GET_MAIL_TEMPLATE_USER_BY_ID_ERROR,
  SAVE_MAIL_TEMPLATE,
  SAVE_MAIL_TEMPLATE_SUCCESS,
  SAVE_MAIL_TEMPLATE_ERROR,
  RESET_STATE,
} from './constants';

export const initialState = {
  loading: null,
  response: null,
  error: null,
  DataById: null,
  success: null,
};

/* eslint-disable default-case, no-param-reassign */
const inviteAllClientEmailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case GET_MAIL_TEMPLATE_USER:
        draft.loading = true;
        draft.response = null;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_USER_SUCCESS:
        draft.loading = null;
        draft.response = action.payload.data;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_USER_ERROR:
        draft.loading = null;
        draft.response = null;
        draft.error = action.error;
        break;
      case GET_MAIL_TEMPLATE_USER_BY_ID:
        draft.loading = true;
        draft.DataById = null;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_USER_BY_ID_SUCCESS:
        draft.loading = null;
        draft.DataById = action.payload.data;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_USER_BY_ID_ERROR:
        draft.loading = null;
        draft.DataById = null;
        draft.error = action.error;
        break;
      case SAVE_MAIL_TEMPLATE:
        draft.loading = true;
        draft.success = null;
        draft.error = null;
        break;
      case SAVE_MAIL_TEMPLATE_SUCCESS:
        draft.loading = null;
        draft.success = action.payload.success;
        draft.error = null;
        break;
      case SAVE_MAIL_TEMPLATE_ERROR:
        draft.loading = null;
        draft.success = null;
        draft.error = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.success = null;
        draft.error = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default inviteAllClientEmailReducer;
