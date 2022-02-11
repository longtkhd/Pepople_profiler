import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createJobState state domain
 */

const selectCreateJobStateDomain = state =>
  state.createJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateJobState
 */

const makeSelectCreateJobState = () =>
  createSelector(
    selectCreateJobStateDomain,
    substate => substate,
  );

export default makeSelectCreateJobState;
export { selectCreateJobStateDomain };
