/*
 *
 * NotificationSetting reducer
 *
 */
import produce from 'immer';
import {
  GET_NOTIFICATION_SETTING,
  GET_NOTIFICATION_SETTING_SUCCESS,
  GET_NOTIFICATION_SETTING_FAILED,
  UPDATE_NOTIFICATION_SETTING,
  UPDATE_NOTIFICATION_SETTING_SUCCESS,
  UPDATE_NOTIFICATION_SETTING_FAILED,
} from './constants';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  notificationSettingLoading: false,
  notificationSettingError: null,
  notificationSettingResponse: null,
  updateNotificationSettingLoading: false,
  updateNotificationSettingError: null,
  updateNotificationSettingResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const notificationSettingReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_NOTIFICATION_SETTING:
        draft.notificationSettingError = null;
        draft.notificationSettingLoading = true;
        draft.notificationSettingResponse = null;
        break;
      case GET_NOTIFICATION_SETTING_SUCCESS:
        draft.notificationSettingError = null;
        draft.notificationSettingLoading = false;
        draft.notificationSettingResponse = action.response;
        break;
      case GET_NOTIFICATION_SETTING_FAILED:
        draft.notificationSettingError = action.error;
        draft.notificationSettingLoading = false;
        draft.notificationSettings = null;
        break;
      case UPDATE_NOTIFICATION_SETTING:
        draft.updateNotificationSettingError = null;
        draft.updateNotificationSettingLoading = true;
        draft.updateNotificationSettingResponse = null;
        break;
      case UPDATE_NOTIFICATION_SETTING_SUCCESS:
        draft.updateNotificationSettingError = null;
        draft.updateNotificationSettingLoading = false;
        draft.updateNotificationSettingResponse = action.response;
        break;
      case UPDATE_NOTIFICATION_SETTING_FAILED:
        draft.updateNotificationSettingError = action.error;
        draft.updateNotificationSettingLoading = false;
        draft.updateNotificationSettingResponse = null;
        break;
      case LOCATION_CHANGE:
        draft.notificationSettingError = null;
        draft.notificationSettingLoading = false;
        draft.notificationSettings = null;
        draft.updateNotificationSettingError = null;
        draft.updateNotificationSettingLoading = false;
        draft.updateNotificationSettingResponse = null;
      default:
        break;
    }
  });

export default notificationSettingReducer;
