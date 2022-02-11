/*
 *
 * EditEmailTemplate reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  EDIT_MAIL_TEMPLATE,
  EDIT_MAIL_TEMPLATE_SUCCESS,
  EDIT_MAIL_TEMPLATE_ERROR,
  GET_MAIL_TEMPLATE_BY_ID,
  GET_MAIL_TEMPLATE_BY_ID_SUCCESS,
  GET_MAIL_TEMPLATE_BY_ID_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: null,
  response: null,
  error: null,
  mailTemplateInfo: null,

};

/* eslint-disable default-case, no-param-reassign */
const editEmailTemplateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case EDIT_MAIL_TEMPLATE:
        draft.loading = true;
        draft.response = null;
        draft.error = null;
        break;
      case EDIT_MAIL_TEMPLATE_SUCCESS:
        draft.loading = null;
        draft.response = action.payload.data;
        draft.error = null;
        break;
      case EDIT_MAIL_TEMPLATE_ERROR:
        draft.loading = null;
        draft.response = null;
        draft.error = action.error;
        break;
      case GET_MAIL_TEMPLATE_BY_ID:
        draft.loading = true;
        draft.mailTemplateInfo = null;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_BY_ID_SUCCESS:
        draft.loading = null;
        draft.mailTemplateInfo = action.payload.data;
        draft.error = null;
        break;
      case GET_MAIL_TEMPLATE_BY_ID_ERROR:
        draft.loading = null;
        draft.mailTemplateInfo = null;
        draft.error = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.response = null;
        draft.error = null;
        break;

      case DEFAULT_ACTION:
        break;
    }
  });

export default editEmailTemplateReducer;
