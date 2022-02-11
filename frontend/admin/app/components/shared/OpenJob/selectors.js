import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the openJob state domain
 */

const selectOpenJobDomain = state => state.openJob || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OpenJob
 */

const makeSelectAssignRecruiterLoading = () =>
  createSelector(
    selectOpenJobDomain,
    substate => substate.assignRecruiterLoading,
  );


const makeSelectAssignRecruiterError = () =>
  createSelector(
    selectOpenJobDomain,
    substate => substate.assignRecruiterError,
  );

const makeSelectAssignRecruiterResponse = () =>
  createSelector(
    selectOpenJobDomain,
    substate => substate.assignRecruiterResponse,
  );

export { 
  makeSelectAssignRecruiterLoading,
  makeSelectAssignRecruiterError,
  makeSelectAssignRecruiterResponse,
};
