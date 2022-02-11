import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update recruiter state domain
 */

const selectUpdateRecruiterDomain = state => state.updateRecruiter || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Recruiter
 */

const makeSelectUpdateRecruiterLoading = () =>
  createSelector(
    selectUpdateRecruiterDomain,
    substate => substate.loading,
  );


const makeSelectUpdateRecruiterError = () =>
  createSelector(
    selectUpdateRecruiterDomain,
    substate => substate.error,
  );

const makeSelectUpdateRecruiterResponse = () =>
  createSelector(
    selectUpdateRecruiterDomain,
    substate => substate.response,
  );

export { 
  makeSelectUpdateRecruiterLoading,
  makeSelectUpdateRecruiterError,
  makeSelectUpdateRecruiterResponse,
};
