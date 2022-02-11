/*
 *
 * InviteAssessmentEmail reducer
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
  SEND_INVITE_ASSESSMENT,
  SEND_INVITE_ASSESSMENT_SUCCESS,
  SEND_INVITE_ASSESSMENT_ERROR
} from './constants';

export const initialState = {
    loading: null,
    response: null,
    error: null,
    DataById: null,
    success: null,
    sent: null
};

/* eslint-disable default-case, no-param-reassign */
const inviteAssessmentEmailReducer = (state = initialState, action) =>
  produce(state, ( draft ) => {
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
      case SEND_INVITE_ASSESSMENT:
       
        draft.loading = true;
        draft.sent = null;
        draft.error =null;
      case SEND_INVITE_ASSESSMENT_SUCCESS:
        draft.loading = null;
        draft.sent = action;
        draft.error = null;
      
       
      case SEND_INVITE_ASSESSMENT_ERROR:
        draft.loading = true;
        draft.sent = null;
        draft.error = action.error;
      
       
        
      case RESET_STATE:
        draft.loading = null;
        draft.sent = null;
        draft.error = null;
        break;
    }
  });

export default inviteAssessmentEmailReducer;
