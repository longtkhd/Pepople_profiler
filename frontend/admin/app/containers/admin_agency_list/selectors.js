import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the agencyPage state domain
 */

const selectAgencyPageDomain = state => state.agencyPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AgencyPage
 */

const makeSelectAgencyPage = () =>
  createSelector(
    selectAgencyPageDomain,
    substate => substate,
  );

export default makeSelectAgencyPage;
export { selectAgencyPageDomain };
