import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the candidateReportEditProfile state domain
 */

const selectCandidateReportEditProfileDomain = state =>
  state.candidateReportEditProfile || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CandidateReportEditProfile
 */

const makeSelectCandidateReportEditProfile = () =>
  createSelector(
    selectCandidateReportEditProfileDomain,
    substate => substate,
  );

export default makeSelectCandidateReportEditProfile;
export { selectCandidateReportEditProfileDomain };
