import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the verify card state domain
 */

const selectVerifyCardDomain = state => state.verifyCardSetup || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectVerifyCardLoading = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.verifyCardLoading,
  );

const makeSelectVerifyCardError = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.verifyCardError,
  );

const makeSelectVerifyCardResponse = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.verifyCardResponse,
  );

export {
  makeSelectVerifyCardLoading,
  makeSelectVerifyCardError,
  makeSelectVerifyCardResponse,
};
