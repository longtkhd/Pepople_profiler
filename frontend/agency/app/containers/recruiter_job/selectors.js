import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterJob state domain
 */

const selectRecruiterJobDomain = state => state.recruiterJob || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterJob
 */

const makeSelectError = () =>
  createSelector(
    selectRecruiterJobDomain,
    substate => substate.error,
  );

const makeSelectOpenJobsLoading = () =>
  createSelector(
    selectRecruiterJobDomain,
    substate => substate.openJobLoading,
  );

const makeSelectOpenJobsResponse = () =>
  createSelector(
    selectRecruiterJobDomain,
    substate => substate.openJobResponse,
  );

const makeSelectClosedJobsLoading = () =>
  createSelector(
    selectRecruiterJobDomain,
    substate => substate.closedJobLoading,
  );

const makeSelectClosedJobsResponse = () =>
  createSelector(
    selectRecruiterJobDomain,
    substate => substate.closedJobResponse,
  );

export { 
  makeSelectError,
  makeSelectOpenJobsLoading,
  makeSelectOpenJobsResponse,
  makeSelectClosedJobsLoading,
  makeSelectClosedJobsResponse,
};
