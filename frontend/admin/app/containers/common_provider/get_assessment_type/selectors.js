import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the getAssessmentType state domain
 */

const selectGetAssessmentTypeDomain = state =>
  state.getAssessmentType || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GetAssessmentType
 */

const makeSelectGetAssessmentType = () =>
  createSelector(
    selectGetAssessmentTypeDomain,
    substate => substate.assessmentType,
  );


const makeSelectGetAssessmentTypeById = () =>
  createSelector(
    selectGetAssessmentTypeDomain,
    substate => substate.assessmentTypeInfo,
  );



export {
  makeSelectGetAssessmentType,
  makeSelectGetAssessmentTypeById
};
