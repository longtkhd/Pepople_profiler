import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminUserList state domain
 */

const selectAdminUserListDomain = state => state.adminUserList || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminUserList
 */

const makeSelectAdminUserList = () =>
  createSelector(
    selectAdminUserListDomain,
    substate => substate,
  );

export default makeSelectAdminUserList;
export { selectAdminUserListDomain };
