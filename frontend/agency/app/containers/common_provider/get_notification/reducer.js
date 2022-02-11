import produce from 'immer';
import {
  GET_NOTIFICATION_LIST,
  GET_NOTIFICATION_LIST_SUCCESS,
  GET_NOTIFICATION_LIST_FAILED,
} from './constants';

export const initialState = {
  getNotificationListLoading: false,
  getNotificationListError: null,
  getNotificationListResponse: null,
};

const getNotificationReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_NOTIFICATION_LIST:
        draft.getNotificationListError = null;
        draft.getNotificationListLoading = true;
        draft.getNotificationListResponse = null;
        break;
      case GET_NOTIFICATION_LIST_SUCCESS:
        draft.getNotificationListError = null;
        draft.getNotificationListLoading = false;
        draft.getNotificationListResponse = action.response;
        break;
      case GET_NOTIFICATION_LIST_FAILED:
        draft.getNotificationListError = action.error;
        draft.getNotificationListLoading = false;
        draft.getNotificationListResponse = null;
        break;
      default:
        break;
    }
  });

export default getNotificationReducer;
