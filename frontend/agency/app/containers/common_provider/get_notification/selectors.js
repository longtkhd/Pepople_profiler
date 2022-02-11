import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectNotificationListDomain = state => state.getNotification || initialState;

const makeSelectGetNotificationListLoading = () =>
  createSelector(
    selectNotificationListDomain,
    substate => substate.getNotificationListLoading,
  );

const makeSelectGetNotificationListError = () =>
  createSelector(
    selectNotificationListDomain,
    substate => substate.getNotificationListError,
  );

const makeSelectGetNotificationListResponse = () =>
  createSelector(
    selectNotificationListDomain,
    substate => substate.getNotificationListResponse,
  );

export {
  makeSelectGetNotificationListLoading,
  makeSelectGetNotificationListError,
  makeSelectGetNotificationListResponse,
};
