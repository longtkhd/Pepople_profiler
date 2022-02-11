import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get recruiter list state domain
 */

const selectGetRecruiterListDomain = state => state.getRecruiterList || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Get Recruiter List
 */

const makeSelectGetRecruiterListLoading = () =>
  createSelector(
    selectGetRecruiterListDomain,
    substate => substate.loading,
  );

const makeSelectGetRecruiterListError = () =>
  createSelector(
    selectGetRecruiterListDomain,
    substate => substate.error,
  );

const makeSelectRecruiterListResponse = () =>
  createSelector(
    selectGetRecruiterListDomain,
    substate => substate.recruiterListResponse,
  );

export { 
  makeSelectGetRecruiterListLoading,
  makeSelectGetRecruiterListError,
  makeSelectRecruiterListResponse,
};
