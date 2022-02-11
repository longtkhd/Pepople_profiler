import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get job state domain
 */

const selectGetJobDomain = state => state.getJob || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterJob
 */

const makeSelectError = () =>
  createSelector(
    selectGetJobDomain,
    substate => substate.error,
  );

const makeSelectJobLoading = () =>
  createSelector(
    selectGetJobDomain,
    substate => substate.loading,
  );

const makeSelectJobResponse = () =>
  createSelector(
    selectGetJobDomain,
    substate => substate.response,
  );

export { 
  makeSelectError,
  makeSelectJobLoading,
  makeSelectJobResponse,
};
