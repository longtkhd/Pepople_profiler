import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboardPage state domain
 */

const selectDashboardPageDomain = state => state.dashboardPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardPage
 */

const makeSelectDashboardPage = () =>
  createSelector(
    selectDashboardPageDomain,
    substate => substate,
  );

const makeSelectDashboardPageLoading = () =>
  createSelector(
    selectDashboardPageDomain,
    substate => substate.loading,
  );

const makeSelectDashboardPageResponse = () =>
  createSelector(
    selectDashboardPageDomain,
    substate => substate.userCount,
  );

const makeSelectParsingPageResponse = () =>
  createSelector(
    selectDashboardPageDomain,
    substate => substate.dataParsing,
  );

const makeSelectAssessmentResponse = () =>
  createSelector(
    selectDashboardPageDomain,
    substate => substate.dataAssessment,
  );

const makeSelectSubscriptionResponse = () =>
  createSelector(
    selectDashboardPageDomain,
    substate => substate.dataSubscription,
  );

export {
  makeSelectDashboardPage,
  makeSelectDashboardPageResponse,
  makeSelectParsingPageResponse,
  makeSelectAssessmentResponse,
  makeSelectSubscriptionResponse,
  makeSelectDashboardPageLoading
};
