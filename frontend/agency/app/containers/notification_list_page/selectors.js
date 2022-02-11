import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the notificationListPage state domain
 */

const selectNotificationListPageDomain = state =>
  state.notificationListPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by NotificationListPage
 */

const makeSelectGetNotificationListLoading = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.getNotificationListLoading,
  );

const makeSelectGetNotificationListError = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.getNotificationListError,
  );

const makeSelectGetNotificationListResponse = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.getNotificationListResponse,
  );

const makeSelectDeleteNotificationLoading = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.deleteNotificationLoading,
  );

const makeSelectDeleteNotificationError = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.deleteNotificationError,
  );

const makeSelectDeleteNotificationResponse = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.deleteNotificationResponse,
  );
const makeSelectDeleteAllNotificationLoading = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.deleteAllNotificationLoading,
  );

const makeSelectDeleteAllNotificationError = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.deleteAllNotificationError,
  );

const makeSelectDeleteAllNotificationResponse = () =>
  createSelector(
    selectNotificationListPageDomain,
    substate => substate.deleteAllNotificationResponse,
  );

export {
  makeSelectGetNotificationListLoading,
  makeSelectGetNotificationListError,
  makeSelectGetNotificationListResponse,
  makeSelectDeleteAllNotificationLoading,
  makeSelectDeleteAllNotificationError,
  makeSelectDeleteAllNotificationResponse,
  makeSelectDeleteNotificationLoading,
  makeSelectDeleteNotificationError,
  makeSelectDeleteNotificationResponse,
};
