import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminAgencyDetails state domain
 */

const selectAdminAgencyDetailsDomain = state =>
  state.adminAgencyDetails || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminAgencyDetails
 */

const makeSelectAdminAgencyDetails = () =>
  createSelector(
    selectAdminAgencyDetailsDomain,
    substate => substate,
  );

export default makeSelectAdminAgencyDetails;
export { selectAdminAgencyDetailsDomain };
