/*
 *
 * NotificationListPage actions
 *
 */

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
import { getNotifications, deleteNotification,deleteAllNotification } from 'services/api/notificationService';

function getNotificationList() {
  return {
    type: GET_NOTIFICATION_LIST,
  };
}

function getNotificationListSuccess(response) {
  return {
    type: GET_NOTIFICATION_LIST_SUCCESS,
    response
  };
}

function getNotificationListFailed(error) {
  return {
    type: GET_NOTIFICATION_LIST_FAILED,
    error
  };
}

function deleteNotificationAction() {
  return {
    type: DELETE_NOTIFICATION,
  };
}

function deleteNotificationSuccess(response) {
  return {
    type: DELETE_NOTIFICATION_SUCCESS,
    response
  };
}

function deleteNotificationFailed(error) {
  return {
    type: DELETE_NOTIFICATION_FAILED,
    error
  };
}

function deleteAllNotificationAction() {
  return {
    type: DELETE_ALL_NOTIFICATION,
  };
}

function deleteAllNotificationSuccess(response) {
  return {
    type: DELETE_ALL_NOTIFICATION_SUCCESS,
    response
  };
}

function deleteAllNotificationFailed(error) {
  return {
    type: DELETE_ALL_NOTIFICATION_FAILED,
    error
  };
}

export const getNotificationListAction = data => {
  return async dispatch => {
    try {
      dispatch(getNotificationList());
      const response = await getNotifications(data);
      dispatch(getNotificationListSuccess(response.data))
    } catch (error) {
      dispatch(getNotificationListFailed(error.response?.data));
    }
  }
}

export const removeNotification = notificationId => {
  return async dispatch => {
    try {
      dispatch(deleteNotificationAction());
      const response = await deleteNotification(notificationId);
      dispatch(deleteNotificationSuccess(response.data))
    } catch (error) {
      dispatch(deleteNotificationFailed(error.response?.data));
    }
  }
}
export const removeAllNotification = listNotificationId => {
  
  return async dispatch => {
    try {
      dispatch(deleteAllNotificationAction());
      const response = await deleteAllNotification( {
        list: listNotificationId
      });
      dispatch(deleteAllNotificationSuccess(response?.data))
    } catch (error) {
      dispatch(deleteAllNotificationFailed(error.response?.data));
    }
  }
}
