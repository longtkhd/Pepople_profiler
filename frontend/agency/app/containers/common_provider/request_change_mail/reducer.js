/*
 *
 * RequestChangeMail reducer
 *
 */
import produce from 'immer';
import {
  DEFAULT_ACTION,
  REQUEST_CHANGE_MAIL,
  REQUEST_CHANGE_MAIL_SUCCESS,
  REQUEST_CHANGE_MAIL_ERROR,
  RESET_STATE
} from './constants';

export const initialState = {
  loading: null,
  success: null,
  error: null
};

/* eslint-disable default-case, no-param-reassign */
const requestChangeMailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_CHANGE_MAIL:
        draft.loading = true;
        draft.success = null;
        draft.error = null;
        break;
      case REQUEST_CHANGE_MAIL_SUCCESS:
        draft.loading = null;
        draft.success = action.payload;
        draft.error = null;
        break;
      case REQUEST_CHANGE_MAIL_ERROR:
        draft.loading = null;
        draft.success = null;
        draft.error = action.error;
        break;
      case RESET_STATE:
        draft.loading = null;
        draft.success = null;
        draft.error = null;

      case DEFAULT_ACTION:
        break;
    }
  });

export default requestChangeMailReducer;
