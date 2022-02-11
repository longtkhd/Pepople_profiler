import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the jobDetailState state domain
 */

const selectJobDetailDomain = state =>
  state.jobDetail || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by jobDetailState
 */


const makeSelectJobListLoading = () =>
  createSelector(
    selectJobDetailDomain,
  substate => substate?.loading,
);

export { selectJobDetailDomain, makeSelectJobListLoading };
