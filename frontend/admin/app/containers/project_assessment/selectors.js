import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the projectAssessment state domain
 */

const selectProjectAssessmentDomain = state =>
  state.projectAssessment || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProjectAssessment
 */

const makeSelectProjectAssessment = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate,
  );

const makeSelectDeleteProjectAssessmentSuccess = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.success,
  );

const makeSelectDeleteProjectAssessmentError = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.error,
  );


export {
  makeSelectProjectAssessment,
  makeSelectDeleteProjectAssessmentSuccess,
  makeSelectDeleteProjectAssessmentError


};
