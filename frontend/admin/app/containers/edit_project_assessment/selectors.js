import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editProjectAssessment state domain
 */

const selectEditProjectAssessmentDomain = state =>
  state.editProjectAssessment || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditProjectAssessment
 */

const makeSelectEditProjectAssessment = () =>
  createSelector(
    selectEditProjectAssessmentDomain,
    substate => substate,
  );

export default makeSelectEditProjectAssessment;
export { selectEditProjectAssessmentDomain };
