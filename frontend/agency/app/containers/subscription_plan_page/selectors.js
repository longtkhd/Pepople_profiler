import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the agencyPlanPage state domain
 */

const selectAgencyPlanPageDomain = state =>
  state.agencyPlanPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AgencyPlanPage
 */

const makeSelectAgencyPlanPage = () =>
  createSelector(
    selectAgencyPlanPageDomain,
    substate => substate,
  );

export default makeSelectAgencyPlanPage;
export { selectAgencyPlanPageDomain };
