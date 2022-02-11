import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update notification state domain
 */

const selectUpdateNotificationSettingSetupDomain = state => state.updateNotificationSettingSetup || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Notification
 */

const makeSelectUpdateNotificationSettingLoading = () =>
  createSelector(
    selectUpdateNotificationSettingSetupDomain,
    substate => substate.updateNotificationSettingLoading,
  );  

const makeSelectUpdateNotificationSettingError = () =>
  createSelector(
    selectUpdateNotificationSettingSetupDomain,
    substate => substate.updateNotificationSettingError,
  );

const makeSelectUpdateNotificationSettingResponse = () =>
  createSelector(
    selectUpdateNotificationSettingSetupDomain,
    substate => substate.updateNotificationSettingResponse,
  );

export { 
  makeSelectUpdateNotificationSettingLoading,
  makeSelectUpdateNotificationSettingError,
  makeSelectUpdateNotificationSettingResponse,
};
