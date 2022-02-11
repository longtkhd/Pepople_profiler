import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminRecruiterList state domain
 */

const selectAdminRecruiterListDomain = state =>
  state.adminRecruiterList || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminRecruiterList
 */

const makeSelectAdminRecruiterList = () =>
  createSelector(
    selectAdminRecruiterListDomain,
    substate => substate,
  );

export default makeSelectAdminRecruiterList;
export { selectAdminRecruiterListDomain };
