import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectShortlistedCandidateJobDomain = state => state.shortlistedCandidateJobState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectShortlistedCandidateJobLoading = () =>
  createSelector(
    selectShortlistedCandidateJobDomain,
    substate => substate?.loading,
  );

  const makeSelectShortlistedCandidateJobResult = () =>
  createSelector(
    selectShortlistedCandidateJobDomain,
    substate => substate?.result?.data?.candidate_list,
  );



export {
  makeSelectShortlistedCandidateJobLoading,
  makeSelectShortlistedCandidateJobResult,
};
