import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminAssessmentType state domain
 */

const selectAdminAssessmentTypeDomain = state =>
  state.adminAssessmentType || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminAssessmentType
 */

const makeSelectAdminAssessmentType = () =>
  createSelector(
    selectAdminAssessmentTypeDomain,
    substate => substate,
  );

const makeSelectAdminAssessmentTypeSuccess = () =>
  createSelector(
    selectAdminAssessmentTypeDomain,
    substate => substate.success,
  );

const makeSelectAdminAssessmentTypeError = () =>
  createSelector(
    selectAdminAssessmentTypeDomain,
    substate => substate.error,
  );



export {
  makeSelectAdminAssessmentType,
  makeSelectAdminAssessmentTypeSuccess,
  makeSelectAdminAssessmentTypeError

};
