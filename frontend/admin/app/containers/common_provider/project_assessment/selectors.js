import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the projectAssessment state domain
 */

const selectProjectAssessmentDomain = state =>
  state.projectAssessmentState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProjectAssessment
 */

const makeSelectProjectAssessment = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.loading,
  );

const makeSelectGetProjectAssessmentLoading = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.loading,
  );

const makeSelectGetProjectAssessmentError = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.error,
  );

const makeSelectGetProjectAssessmentInfo = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.projectAssessment,
  );

const makeSelectGetProjectAssessmentById = () =>
  createSelector(
    selectProjectAssessmentDomain,
    substate => substate.projectAssessmentInfo,
  );






export {
  makeSelectProjectAssessment,
  makeSelectGetProjectAssessmentLoading,
  makeSelectGetProjectAssessmentError,
  makeSelectGetProjectAssessmentInfo,
  makeSelectGetProjectAssessmentById



};
