import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterDetailsPage state domain
 */

const selectRecruiterDetailsPageDomain = state =>
  state.recruiterDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterDetailsPage
 */

const makeSelectGetRecruiterDetailsLoading = () =>
  createSelector(
    selectRecruiterDetailsPageDomain,
    substate => substate.loading,
  );

const makeSelectGetRecruiterDetailsError = () =>
  createSelector(
    selectRecruiterDetailsPageDomain,
    substate => substate.error,
  );

const makeSelectRecruiterDetails = () =>
  createSelector(
    selectRecruiterDetailsPageDomain,
    substate => substate.recruiterDetails,
  );

export { 
  makeSelectGetRecruiterDetailsLoading,
  makeSelectGetRecruiterDetailsError,
  makeSelectRecruiterDetails,
};
