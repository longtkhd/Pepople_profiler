import {
  GET_NOTIFICATION_LIST,
  GET_NOTIFICATION_LIST_SUCCESS,
  GET_NOTIFICATION_LIST_FAILED,
} from './constants';
import { getNotifications } from 'services/api/notificationService';

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

export default data => {
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
