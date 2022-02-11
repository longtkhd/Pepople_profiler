import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectUpdateServerNotificationDomain = state => state.updateServerNotification || initialState;

const makeSelectGetServerNotification = () =>
  createSelector(
    selectUpdateServerNotificationDomain,
    substate => substate.serverNotification,
  );

export {
  makeSelectGetServerNotification
};
