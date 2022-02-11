import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create client state domain
 */

const selectCandidateExistingDomain = state => state.candidateExistingState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectCandidateExistingLoading = () =>
  createSelector(
    selectCandidateExistingDomain,
    substate => substate?.loading,
  );

  const makeSelectCandidateExistingResult = () =>
  createSelector(
    selectCandidateExistingDomain,
    substate => substate?.result?.data?.candidate_list,
  );



export {
  makeSelectCandidateExistingLoading,
  makeSelectCandidateExistingResult,
};
