import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editProjectAssessment state domain
 */

const selectEditProjectAssessmentDomain = state =>
  state.editProjectAssessmentState || initialState;

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

const makeSelectEditProjectAssessmentSuccess = () =>
  createSelector(
    selectEditProjectAssessmentDomain,
    substate => substate.success,
  );

const makeSelectEditProjectAssessmentError = () =>
  createSelector(
    selectEditProjectAssessmentDomain,
    substate => substate.error,
  );


export {
  makeSelectEditProjectAssessment,
  makeSelectEditProjectAssessmentSuccess,
  makeSelectEditProjectAssessmentError

};
