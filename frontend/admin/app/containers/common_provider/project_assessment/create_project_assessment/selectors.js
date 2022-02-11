import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createProjectAssessment state domain
 */

const selectCreateProjectAssessmentDomain = state =>
  state.createProjectAssessmentReducerState || initialState;

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

const makeSelectCreateProjectAssessmentLoading = () =>
  createSelector(
    selectCreateProjectAssessmentDomain,
    substate => substate.loading,
  );

const makeSelectCreateProjectAssessmentSuccess = () =>
  createSelector(
    selectCreateProjectAssessmentDomain,
    substate => substate.response,
  );

const makeSelectCreateProjectAssessmentError = () =>
  createSelector(
    selectCreateProjectAssessmentDomain,
    substate => substate.error,
  );

export {
  makeSelectCreateProjectAssessment,
  makeSelectCreateProjectAssessmentLoading,
  makeSelectCreateProjectAssessmentSuccess,
  makeSelectCreateProjectAssessmentError
};
