import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminAgencyInfoPage state domain
 */

const selectAdminAgencyInfoPageDomain = state =>
  state.adminAgencyInfoPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminAgencyInfoPage
 */

const makeSelectAdminAgencyInfoPage = () =>
  createSelector(
    selectAdminAgencyInfoPageDomain,
    substate => substate,
  );

export default makeSelectAdminAgencyInfoPage;
export { selectAdminAgencyInfoPageDomain };
