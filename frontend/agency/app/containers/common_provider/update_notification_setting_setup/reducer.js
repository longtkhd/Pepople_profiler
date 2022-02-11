/*
 *
 * Update notification reducer
 *
 */
import produce from 'immer';
import { 
  UPDATE_NOTIFICATION_SETTING,
  UPDATE_NOTIFICATION_SETTING_SUCCESS,
  UPDATE_NOTIFICATION_SETTING_FAILED,
} from './constants';
import { LOCATION_CHANGE } from 'connected-react-router';

export const initialState = {
  updateNotificationSettingLoading: false,
  updateNotificationSettingError: null,
  updateNotificationSettingResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const updateNotificationSettingSetupReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
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
        draft.updateNotificationSettingError = null;
        draft.updateNotificationSettingLoading = false;
        draft.updateNotificationSettingResponse = null;
      default:
        break;
    }
  });

export default updateNotificationSettingSetupReducer;
