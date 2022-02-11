import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get open job state domain
 */

const selectGetOpenJobDomain = state => state.getOpenJob || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterJob
 */

const makeSelectError = () =>
  createSelector(
    selectGetOpenJobDomain,
    substate => substate.error,
  );

const makeSelectOpenJobsLoading = () =>
  createSelector(
    selectGetOpenJobDomain,
    substate => substate.openJobLoading,
  );

const makeSelectOpenJobsResponse = () =>
  createSelector(
    selectGetOpenJobDomain,
    substate => substate.openJobResponse,
  );

export { 
  makeSelectError,
  makeSelectOpenJobsLoading,
  makeSelectOpenJobsResponse,
};
