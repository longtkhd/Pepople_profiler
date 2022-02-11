import API from './index';
import { API_KEY } from 'constants/config';

const NOTIFICATION_KEY = API_KEY.NOTIFICATION_KEY;
const DELETE_NOTIFICATION = API_KEY.DELETE_NOTIFICATION;


export const getNotifications = params => {
  return API.get(`${NOTIFICATION_KEY}`, { params });
}

export const updateNotification = (notificationId, params) => {
  return API.put(`${NOTIFICATION_KEY}/${notificationId}`, params);
}

export const deleteNotification = notificationId => {
  return API.delete(`${NOTIFICATION_KEY}/${notificationId}`);
}
export const deleteAllNotification = (params) => {
  return API.post(`${NOTIFICATION_KEY}/${DELETE_NOTIFICATION}`, params);
}
