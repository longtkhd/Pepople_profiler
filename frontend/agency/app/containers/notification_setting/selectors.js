import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the notificationSetting state domain
 */

const selectNotificationSettingDomain = state =>
  state.notificationSetting || initialState;

/**
 * Other specific selectors
 */

const makeSelectNotificationSettingLoading = () =>
createSelector(
  selectNotificationSettingDomain,
  substate => substate.notificationSettingLoading,
);

const makeSelectNotificationSettingError = () =>
createSelector(
  selectNotificationSettingDomain,
  substate => substate.notificationSettingError,
);

const makeSelectNotificationSetting = () =>
createSelector(
  selectNotificationSettingDomain,
  substate => substate.notificationSettingResponse,
);

const makeSelectUpdateNotificationSettingLoading = () =>
createSelector(
  selectNotificationSettingDomain,
  substate => substate.updateNotificationSettingLoading,
);

const makeSelectUpdateNotificationSettingError = () =>
createSelector(
  selectNotificationSettingDomain,
  substate => substate.updateNotificationSettingError,
);

const makeSelectUpdateNotificationSettingResponse = () =>
createSelector(
  selectNotificationSettingDomain,
  substate => substate.updateNotificationSettingResponse,
);

export { 
  makeSelectNotificationSettingLoading,
  makeSelectNotificationSettingError,
  makeSelectNotificationSetting,
  makeSelectUpdateNotificationSettingLoading,
  makeSelectUpdateNotificationSettingError,
  makeSelectUpdateNotificationSettingResponse,
};