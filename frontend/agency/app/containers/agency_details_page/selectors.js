import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the agencyDetailsPage state domain
 */

const selectAgencyDetailsPageDomain = state =>
  state.agencyDetailsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AgencyDetailsPage
 */

const makeSelectAgencyDetailsPage = () =>
  createSelector(
    selectAgencyDetailsPageDomain,
    substate => substate,
  );

export default makeSelectAgencyDetailsPage;
export { selectAgencyDetailsPageDomain };
