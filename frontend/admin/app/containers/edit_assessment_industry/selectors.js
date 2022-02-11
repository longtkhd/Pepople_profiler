import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editAssessmentIndustry state domain
 */

const selectEditAssessmentIndustryDomain = state =>
  state.editAssessmentIndustry || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditAssessmentIndustry
 */

const makeSelectEditAssessmentIndustry = () =>
  createSelector(
    selectEditAssessmentIndustryDomain,
    substate => substate,
  );

const makeSelectEditAssessmentIndustryLoading = () =>
  createSelector(
    selectEditAssessmentIndustryDomain,
    substate => substate.loading,
  );


const makeSelectEditAssessmentIndustrySuccess = () =>
  createSelector(
    selectEditAssessmentIndustryDomain,
    substate => substate.success,
  );

const makeSelectEditAssessmentIndustryError = () =>
  createSelector(
    selectEditAssessmentIndustryDomain,
    substate => substate.error,
  );



// export default makeSelectEditAssessmentIndustry;
export {
  makeSelectEditAssessmentIndustry,
  makeSelectEditAssessmentIndustryLoading,
  makeSelectEditAssessmentIndustryError,
  makeSelectEditAssessmentIndustrySuccess
};
