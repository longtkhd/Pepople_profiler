/*
 *
 * Update notification actions
 *
 */

import { 
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_ERROR,
} from './constants';
import { updateNotification } from 'services/api/notificationService';

export default (notificationId, data) => {
  return async dispatch => {
    try {
      dispatch(updateNotificationAction());
      const response = await updateNotification(notificationId, data);
      dispatch(updateNotificationSuccess(response.data));
    } catch (err) {
      dispatch(updateNotificationError(err.response?.data));
    }
  }
}

function updateNotificationAction() {
  return {
    type: UPDATE_NOTIFICATION,
  };
}

function updateNotificationSuccess(response) {
  return {
    type: UPDATE_NOTIFICATION_SUCCESS,
    response
  };
}

function updateNotificationError(error) {
  return {
    type: UPDATE_NOTIFICATION_ERROR,
    error
  };
}