import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientJobDashboard state domain
 */

const selectClientJobDashboardDomain = state =>
  state.clientJobDashboard || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClientJobDashboard
 */

const makeSelectClientJobDashboardLoading = () =>
  createSelector(
    selectClientJobDashboardDomain,
    substate => substate.dashboardLoading,
  );
const makeSelectClientJobDashboardSuccess = () =>
  createSelector(
    selectClientJobDashboardDomain,
    substate => substate.dashboardDetail,
  );
const makeSelectClientJobDashboardError = () =>
  createSelector(
    selectClientJobDashboardDomain,
    substate => substate.dashboardError,
  );

export {
  makeSelectClientJobDashboardLoading,
  makeSelectClientJobDashboardSuccess,
  makeSelectClientJobDashboardError,
};
