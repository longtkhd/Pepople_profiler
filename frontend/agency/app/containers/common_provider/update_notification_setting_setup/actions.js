/*
 *
 * Update notification actions
 *
 */

import { 
  UPDATE_NOTIFICATION_SETTING,
  UPDATE_NOTIFICATION_SETTING_SUCCESS,
  UPDATE_NOTIFICATION_SETTING_FAILED,
} from './constants';
import { updateNotificationSettingsSetup } from 'services/api/userService';

export default (accessToken, data) => {
  return async dispatch => {
    try {
      dispatch(updateNotificationSetting());
      const response = await updateNotificationSettingsSetup(accessToken, data);
      dispatch(updateNotificationSettingSuccess(response?.data));
    } catch (error) {
      dispatch(updateNotificationSettingFailed(error.response?.data));
    }
  }
}

function updateNotificationSetting() { return { type: UPDATE_NOTIFICATION_SETTING } }
function updateNotificationSettingSuccess(response) { return { type: UPDATE_NOTIFICATION_SETTING_SUCCESS, response } }
function updateNotificationSettingFailed(error) { return { type: UPDATE_NOTIFICATION_SETTING_FAILED, error } }