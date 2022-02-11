/*
 *
 * SendMailAssessment reducer
 *
 */
import produce from 'immer';
import {
  SEND_INVITE_ASSESSMENT,
  SEND_INVITE_ASSESSMENT_SUCCESS,
  SEND_INVITE_ASSESSMENT_ERROR,
  RESET_STATE,
} from './constants';

export const initialState = {
  loading: null,
  error: null,
  sent: null,
};

/* eslint-disable default-case, no-param-reassign */
const sendMailAssessmentReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SEND_INVITE_ASSESSMENT:
        draft.loading = true;
        draft.success = null;
        draft.error = null;
        break;
      case SEND_INVITE_ASSESSMENT_SUCCESS:
        draft.loading = null;
        draft.sent = action?.payload?.success;
        draft.error = null;
        break;
      case SEND_INVITE_ASSESSMENT_ERROR:
        draft.loading = true;
        draft.sent = null;
        draft.error = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.sent = null;
        draft.error = null;
        break;
    }
  });

export default sendMailAssessmentReducer;
