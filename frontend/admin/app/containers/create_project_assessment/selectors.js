import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createProjectAssessment state domain
 */

const selectCreateProjectAssessmentDomain = state =>
  state.createProjectAssessment || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateProjectAssessment
 */

const makeSelectCreateProjectAssessment = () =>
  createSelector(
    selectCreateProjectAssessmentDomain,
    substate => substate,
  );

export default makeSelectCreateProjectAssessment;
export { selectCreateProjectAssessmentDomain };
