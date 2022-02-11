import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the jobList state domain
 */

const selectJobListDomain = state => state.jobList || initialState;

const selectJobListStateDomain = state => state.jobListState || initialState;
/**
 * Other specific selectors
 */

/**
 * Default selector used by JobList
 */

const makeSelectJobList = () =>
  createSelector(
    selectJobListDomain,
    substate => substate,
  );

const makeSelectJobListSuccess = () =>
  createSelector(
    selectJobListStateDomain,
    substate => substate?.jobList?.data?.job_list,
  );


const makeSelectJobListLoading = () =>
createSelector(
  selectJobListStateDomain,
  substate => substate?.loading
);
export default makeSelectJobList;
export {
  makeSelectJobListSuccess,
  makeSelectJobListLoading,
  selectJobListDomain };
