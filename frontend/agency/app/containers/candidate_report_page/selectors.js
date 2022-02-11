import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the candidateReportPage state domain
 */

const selectCandidateReportPageDomain = state =>
  state.candidateReportPage || initialState;



/**
 * Other specific selectors
 */

/**
 * Default selector used by CandidateReportPage
 */

const makeSelectCandidateReportPage = () =>
  createSelector(
    selectCandidateReportPageDomain,
    substate => substate,
  );
const makeSelectCandidateIdPage = () =>
  createSelector(
    selectCandidateReportPageDomain,
    substate => substate?.candidateId,
  );

export default makeSelectCandidateReportPage;
export { selectCandidateReportPageDomain ,makeSelectCandidateIdPage};
