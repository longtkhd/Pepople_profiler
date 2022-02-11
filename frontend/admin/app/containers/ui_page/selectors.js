import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the uIpage state domain
 */

const selectUIpageDomain = state => state.uIpage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UIpage
 */

const makeSelectUIpage = () =>
  createSelector(
    selectUIpageDomain,
    substate => substate,
  );

export default makeSelectUIpage;
export { selectUIpageDomain };
