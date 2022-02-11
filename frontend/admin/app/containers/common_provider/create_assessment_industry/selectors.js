import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createAssessmentIndustry state domain
 */

const selectCreateAssessmentIndustryDomain = state =>
  state.createAssessmentIndustries || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateAssessmentIndustry
 */

const makeSelectCreateAssessmentIndustry = () =>
  createSelector(
    selectCreateAssessmentIndustryDomain,
    substate => substate,
  );
const makeSelectCreateAssessmentIndustryLoading = () =>
  createSelector(
    selectCreateAssessmentIndustryDomain,
    substate => substate.loading,
  );

const makeSelectCreateAssessmentIndustrySuccess = () =>
  createSelector(
    selectCreateAssessmentIndustryDomain,
    substate => substate.response,
  );

const makeSelectCreateAssessmentIndustryError = () =>
  createSelector(
    selectCreateAssessmentIndustryDomain,
    substate => substate.error,
  );

export {
  makeSelectCreateAssessmentIndustry,
  makeSelectCreateAssessmentIndustryLoading,
  makeSelectCreateAssessmentIndustrySuccess,
  makeSelectCreateAssessmentIndustryError

};
