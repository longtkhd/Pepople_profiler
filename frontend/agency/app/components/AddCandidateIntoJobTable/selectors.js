import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the GetJobListListPage state domain
 */

const selectGetJobListPageDomain = state =>
  state.getJobListPage || initialState;


/**
 * Other specific selectors
 */

/**
 * Default selector used by GetJobListListPage
 */

const makeSelectGetJobList = () =>
  createSelector(
    selectGetJobListPageDomain,
    substate => substate,
  );
const makeSelectGetJobListLoading = () =>
  createSelector(
    selectGetJobListPageDomain,
    substate => substate.loading,
  );

const makeSelectGetJobListError = () =>
  createSelector(
    selectGetJobListPageDomain,
    substate => substate.error,
  );

const makeSelectGetJobListData = () =>
  createSelector(
    selectGetJobListPageDomain,
    substate => substate.job_list,
  );

export default makeSelectGetJobList;

export {
  makeSelectGetJobListLoading,
  makeSelectGetJobListError,
  makeSelectGetJobListData,
};
