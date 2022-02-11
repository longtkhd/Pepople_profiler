import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createAssessmentIndustry state domain
 */

const selectCreateAssessmentIndustryDomain = state =>
  state.createAssessmentIndustry || initialState;

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

export default makeSelectCreateAssessmentIndustry;
export { selectCreateAssessmentIndustryDomain };
