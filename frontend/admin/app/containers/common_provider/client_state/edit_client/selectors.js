import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createJobState state domain
 */

const selectEditClientState = state => state.editClientState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateJobState
 */

const makeSelectEditClientResult = () =>
  createSelector(
    selectEditClientState,
    substate => substate?.result,
  );
const makeSelectEditClientLoading = () =>
  createSelector(
    selectEditClientState,
    substate => substate?.loading,
  );

export {
  selectEditClientState,
  makeSelectEditClientResult,
  makeSelectEditClientLoading,
};
