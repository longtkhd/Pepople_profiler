import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminAssessment state domain
 */

const selectAdminAssessmentDomain = state =>
  state.adminAssessment || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminAssessment
 */

const makeSelectAdminAssessment = () =>
  createSelector(
    selectAdminAssessmentDomain,
    substate => substate,
  );
const makeSelectAdminAssessmentSuccess = () =>
  createSelector(
    selectAdminAssessmentDomain,
    substate => substate.success,
  );

const makeSelectAdminAssessmentError = () =>
  createSelector(
    selectAdminAssessmentDomain,
    substate => substate.error,
  );



export {
  makeSelectAdminAssessment,
  makeSelectAdminAssessmentSuccess,
  makeSelectAdminAssessmentError

};
