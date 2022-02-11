import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editAssessmentType state domain
 */

const selectEditAssessmentTypeDomain = state =>
  state.editAssessmentType || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditAssessmentType
 */

const makeSelectEditAssessmentType = () =>
  createSelector(
    selectEditAssessmentTypeDomain,
    substate => substate,
  );


const makeSelectEditAssessmentTypeSuccess = () =>
  createSelector(
    selectEditAssessmentTypeDomain,
    substate => substate.success,
  );

const makeSelectEditAssessmentTypeError = () =>
  createSelector(
    selectEditAssessmentTypeDomain,
    substate => substate.error,
  );


export default makeSelectEditAssessmentType;
export { makeSelectEditAssessmentTypeSuccess, makeSelectEditAssessmentTypeError };
