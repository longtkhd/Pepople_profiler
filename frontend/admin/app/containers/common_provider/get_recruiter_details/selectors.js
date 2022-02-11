import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get recruiters details state domain
 */

const selectGetRecruiterDetailsDomain = state => state.getRecruiterDetails || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Get Recruiter Details
 */

const makeSelectGetRecruiterDetailsLoading = () =>
  createSelector(
    selectGetRecruiterDetailsDomain,
    substate => substate.loading,
  );

const makeSelectGetRecruiterDetailsError = () =>
  createSelector(
    selectGetRecruiterDetailsDomain,
    substate => substate.error,
  );

const makeSelectRecruiterDetails = () =>
  createSelector(
    selectGetRecruiterDetailsDomain,
    substate => substate.recruiterDetails,
  );

export { 
  makeSelectGetRecruiterDetailsLoading,
  makeSelectGetRecruiterDetailsError,
  makeSelectRecruiterDetails,
};
