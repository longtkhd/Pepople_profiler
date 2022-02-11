/*
 *
 * NotificationSetting actions
 *
 */

import {
  GET_NOTIFICATION_SETTING,
  GET_NOTIFICATION_SETTING_SUCCESS,
  GET_NOTIFICATION_SETTING_FAILED,
  UPDATE_NOTIFICATION_SETTING,
  UPDATE_NOTIFICATION_SETTING_SUCCESS,
  UPDATE_NOTIFICATION_SETTING_FAILED,
} from './constants';
import { getNotificationSettings, updateNotificationSettings } from 'services/api/userService';

function getNotificationSetting() { return { type: GET_NOTIFICATION_SETTING } }
function getNotificationSettingSuccess(response) { return { type: GET_NOTIFICATION_SETTING_SUCCESS, response } }
function getNotificationSettingFailed(error) { return { type: GET_NOTIFICATION_SETTING_FAILED, error } }

function updateNotificationSetting() { return { type: UPDATE_NOTIFICATION_SETTING } }
function updateNotificationSettingSuccess(response) { return { type: UPDATE_NOTIFICATION_SETTING_SUCCESS, response } }
function updateNotificationSettingFailed(error) { return { type: UPDATE_NOTIFICATION_SETTING_FAILED, error } }

export const getNotificationSettingAction = () => {
  return async dispatch => {
    try {
      dispatch(getNotificationSetting());
      const response = await getNotificationSettings();
      dispatch(getNotificationSettingSuccess(response.data));
    } catch (error) {
      dispatch(getNotificationSettingFailed(error.response?.data));
    }
  }
}

export const updateNotificationSettingAction = (data) => {
  return async dispatch => {
    try {
      dispatch(updateNotificationSetting());
      const response = await updateNotificationSettings(data);
      dispatch(updateNotificationSettingSuccess(response.data));
    } catch (error) {
      dispatch(updateNotificationSettingFailed(error.response?.data));
    }
  }
}
