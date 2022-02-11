import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createAssessmentType state domain
 */

const selectCreateAssessmentTypeDomain = state =>
  state.createAssessmentType || initialState;

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

export default makeSelectCreateAssessmentType;
export { selectCreateAssessmentTypeDomain };
