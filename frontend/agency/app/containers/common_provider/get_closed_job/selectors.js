import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get close job state domain
 */

const selectGetClosedJobDomain = state => state.getClosedJob || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterJob
 */

const makeSelectError = () =>
  createSelector(
    selectGetClosedJobDomain,
    substate => substate.error,
  );

const makeSelectClosedJobsLoading = () =>
  createSelector(
    selectGetClosedJobDomain,
    substate => substate.closedJobLoading,
  );

const makeSelectClosedJobsResponse = () =>
  createSelector(
    selectGetClosedJobDomain,
    substate => substate.closedJobResponse,
  );

export { 
  makeSelectError,
  makeSelectClosedJobsLoading,
  makeSelectClosedJobsResponse,
};
