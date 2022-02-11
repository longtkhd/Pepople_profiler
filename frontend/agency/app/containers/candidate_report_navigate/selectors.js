

import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the GetJobListListPage state domain
 */

const selectStateAddCandidateToJobPage = state =>
  state.addCandidateToJobPage || initialState;


/**
 * Other specific selectors
 */

/**
 * Default selector used by GetJobListListPage
 */

const makeselectStateAddCandidateToJob = () =>
  createSelector(
    selectStateAddCandidateToJobPage,
    substate => substate,
  );
const makeSelectGetJobListLoading = () =>
  createSelector(
    selectStateAddCandidateToJobPage,
    substate => substate.loading,
  );

const makeSelectGetJobListError = () =>
  createSelector(
    selectStateAddCandidateToJobPage,
    substate => substate.error,
  );

const makeSelectGetJobListData = () =>
  createSelector(
    selectStateAddCandidateToJobPage,
    substate => substate.job_list,
  );
const makeSelectStatus = () =>
  createSelector(
    selectStateAddCandidateToJobPage,
    substate => substate.statusAdd,
  );
const makeSelectKeyAddCandidateToJob = () =>
  createSelector(
    selectStateAddCandidateToJobPage,
    substate => substate.keyAddCandidateToJob,
  );

export default makeselectStateAddCandidateToJob;

export {
  makeSelectGetJobListLoading,
  makeSelectGetJobListError,
  makeSelectGetJobListData,
  makeSelectStatus,
  makeSelectKeyAddCandidateToJob
};
