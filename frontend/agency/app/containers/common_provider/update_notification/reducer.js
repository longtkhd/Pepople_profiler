/*
 *
 * Update notification reducer
 *
 */
import produce from 'immer';
import { 
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const updateNotificationReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_NOTIFICATION:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case UPDATE_NOTIFICATION_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.response;
        break;
      case UPDATE_NOTIFICATION_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
      default:
        break;
    }
  });

export default updateNotificationReducer;
