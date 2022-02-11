/*
 *
 * NotificationListPage reducer
 *
 */
import produce from 'immer';
import {
  GET_NOTIFICATION_LIST,
  GET_NOTIFICATION_LIST_SUCCESS,
  GET_NOTIFICATION_LIST_FAILED,
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATION_SUCCESS,
  DELETE_NOTIFICATION_FAILED,
  DELETE_ALL_NOTIFICATION,
  DELETE_ALL_NOTIFICATION_SUCCESS,
  DELETE_ALL_NOTIFICATION_FAILED,
} from './constants';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  getNotificationListLoading: false,
  getNotificationListError: null,
  getNotificationListResponse: null,
  deleteNotificationLoading: false,
  deleteNotificationError: null,
  deleteNotificationResponse: null,
  deleteAllNotificationLoading: false,
  deleteAllNotificationError: null,
  deleteAllNotificationResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const notificationListPageReducer = (state = initialState, action) =>
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
      case DELETE_NOTIFICATION:
        draft.deleteNotificationError = null;
        draft.deleteNotificationLoading = true;
        draft.deleteNotificationResponse = null;
        break;
      case DELETE_NOTIFICATION_SUCCESS:
        draft.deleteNotificationError = null;
        draft.deleteNotificationLoading = false;
        draft.deleteNotificationResponse = action.response;
        break;
      case DELETE_NOTIFICATION_FAILED:
        draft.deleteNotificationError = action.error;
        draft.deleteNotificationLoading = false;
        draft.deleteNotificationResponse = null;
        break;


      case DELETE_ALL_NOTIFICATION:
        draft.deleteAllNotificationError = null;
        draft.deleteAllNotificationLoading = true;
        draft.deleteAllNotificationResponse = null;
        break;
      case DELETE_ALL_NOTIFICATION_SUCCESS:
        draft.deleteAllNotificationError = null;
        draft.deleteAllNotificationLoading = false;
        draft.deleteAllNotificationResponse = action.response;
        break;
      case DELETE_ALL_NOTIFICATION_FAILED:
        draft.deleteAllNotificationError = action.error;
        draft.deleteAllNotificationLoading = false;
        draft.deleteAllNotificationResponse = null;
        break;


      case LOCATION_CHANGE:
        draft.deleteNotificationError = null;
        draft.deleteNotificationLoading = false;
        draft.deleteNotificationResponse = null;
        draft.deleteAllNotificationError = null;
        draft.deleteAllNotificationLoading = false;
        draft.deleteAllNotificationResponse = null;
        break;
      default:
        break;
    }
  });

export default notificationListPageReducer;
