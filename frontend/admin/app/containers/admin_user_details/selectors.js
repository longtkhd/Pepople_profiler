import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminUserDetails state domain
 */

const selectAdminUserDetailsDomain = state =>
  state.adminUserDetails || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminUserDetails
 */

const makeSelectAdminUserDetails = () =>
  createSelector(
    selectAdminUserDetailsDomain,
    substate => substate,
  );

export default makeSelectAdminUserDetails;
export { selectAdminUserDetailsDomain };
