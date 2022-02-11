import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the jobListState state domain
 */

const selectJobListDomain = state =>
  state.jobListState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by jobListState
 */

const makeSelectJobListState = () =>
  createSelector(
    selectJobListDomain,
    substate => substate?.jobList?.data?.job_list,
  );

const makeSelectJobListLoading = () =>
  createSelector(
  selectJobListDomain,
  substate => substate?.loading,
);

export default makeSelectJobListState;
export { selectJobListDomain,makeSelectJobListLoading };
