import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update notification state domain
 */

const selectUpdateNotificationDomain = state => state.updateNotification || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Notification
 */

const makeSelectUpdateNotificationLoading = () =>
  createSelector(
    selectUpdateNotificationDomain,
    substate => substate.loading,
  );


const makeSelectUpdateNotificationError = () =>
  createSelector(
    selectUpdateNotificationDomain,
    substate => substate.error,
  );

const makeSelectUpdateNotificationResponse = () =>
  createSelector(
    selectUpdateNotificationDomain,
    substate => substate.response,
  );

export { 
  makeSelectUpdateNotificationLoading,
  makeSelectUpdateNotificationError,
  makeSelectUpdateNotificationResponse,
};
