import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the getAssessment state domain
 */

const selectGetAssessmentDomain = state => state.getAssessment || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by GetAssessment
 */

const makeSelectGetAssessment = () =>
  createSelector(
    selectGetAssessmentDomain,
    substate => substate.assIndustry,
  );

const makeSelectGetAssessmentById = () =>
  createSelector(
    selectGetAssessmentDomain,
    substate => substate.assIndustryById,
  );



const makeSelectGetAssessmentIndustryLoading = () =>
  createSelector(
    selectGetAssessmentDomain,
    substate => substate.loading,
  );

const makeSelectGetAssessmentError = () =>
  createSelector(
    selectGetAssessmentDomain,
    substate => substate.error,
  );

export {
  makeSelectGetAssessment,
  makeSelectGetAssessmentIndustryLoading,
  makeSelectGetAssessmentError,
  makeSelectGetAssessmentById


}


