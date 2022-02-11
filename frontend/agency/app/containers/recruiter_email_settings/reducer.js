/*
 *
 * RecruiterEmailSettings reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  GET_MAIL_TEMPLATE,
  GET_MAIL_TEMPLATE_SUCCESS,
  GET_MAIL_TEMPLATE_ERROR,
  DELETE_MAIL_TEMPLATE,
  DELETE_MAIL_TEMPLATE_SUCCESS,
  DELETE_MAIL_TEMPLATE_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: null,
  response: null,
  error: null,
  deleteStatus: null,
  deleteError: null
};

/* eslint-disable default-case, no-param-reassign */
const recruiterEmailSettingsReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_MAIL_TEMPLATE:
        draft.loading = true;
        draft.response = null;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_SUCCESS:
        draft.loading = null;
        draft.response = action.payload.data;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_ERROR:
        draft.loading = null;
        draft.response = null;
        draft.error = action.error;
        break;
      case DELETE_MAIL_TEMPLATE:
        draft.loading = true;
        draft.deleteStatus = null;
        draft.deleteError = null;
        break;
      case DELETE_MAIL_TEMPLATE_SUCCESS:
        draft.loading = null;
        draft.deleteStatus = action.payload.success;
        draft.deleteError = null;
        break;
      case DELETE_MAIL_TEMPLATE_ERROR:
        draft.loading = null;
        draft.deleteStatus = null;
        draft.deleteError = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.deleteStatus = null;
        draft.error = null;
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default recruiterEmailSettingsReducer;
