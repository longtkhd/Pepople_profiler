import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the change job status state domain
 */

const selectChangeJobStatus = state => state.changeJobStatus || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ChangeJobStatus
 */

const makeSelectChangeJobStatusError = () =>
  createSelector(
    selectChangeJobStatus,
    substate => substate.error,
  );

const makeSelectChangeJobStatusLoading = () =>
  createSelector(
    selectChangeJobStatus,
    substate => substate.loading,
  );

const makeSelectChangeJobStatusResponse = () =>
  createSelector(
    selectChangeJobStatus,
    substate => substate.response,
  );

export { 
  makeSelectChangeJobStatusError,
  makeSelectChangeJobStatusLoading,
  makeSelectChangeJobStatusResponse,
};
