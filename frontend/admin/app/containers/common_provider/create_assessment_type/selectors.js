import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createAssessmentType state domain
 */

const selectCreateAssessmentTypeDomain = state =>
  state.createAssessmentTypes || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateAssessmentType
 */

const makeSelectCreateAssessmentType = () =>
  createSelector(
    selectCreateAssessmentTypeDomain,
    substate => substate,
  );

const makeSelectCreateAssessmentTypeLoading = () =>
  createSelector(
    selectCreateAssessmentTypeDomain,
    substate => substate.loading,
  );

const makeSelectCreateAssessmentTypeSuccess = () =>
  createSelector(
    selectCreateAssessmentTypeDomain,
    substate => substate.success,
  );

const makeSelectCreateAssessmentTypeError = () =>
  createSelector(
    selectCreateAssessmentTypeDomain,
    substate => substate.error,
  );



export {
  makeSelectCreateAssessmentType,
  makeSelectCreateAssessmentTypeLoading,
  makeSelectCreateAssessmentTypeSuccess,
  makeSelectCreateAssessmentTypeError
};
