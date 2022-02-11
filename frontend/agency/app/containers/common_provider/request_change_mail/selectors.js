import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the requestChangeMail state domain
 */

const selectRequestChangeMailDomain = state =>
  state.requestChangeMailState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RequestChangeMail
 */

const makeSelectRequestChangeMail = () =>
  createSelector(
    selectRequestChangeMailDomain,
    substate => substate,
  );
const makeSelectRequestChangeMailSuccess = () =>
  createSelector(
    selectRequestChangeMailDomain,
    substate => substate.success,
  );
const makeSelectRequestChangeMailError = () =>
  createSelector(
    selectRequestChangeMailDomain,
    substate => substate.error,
  );

export {
  makeSelectRequestChangeMail,
  makeSelectRequestChangeMailSuccess,
  makeSelectRequestChangeMailError
};
