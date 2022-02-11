import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the verify card state domain
 */

const selectVerifyCardDomain = state => state.verifyCard || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectVerifyCardLoading = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.verifyCardloading,
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

const makeSelectUpdateCardLoading = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.updateCardLoading,
  );

const makeSelectUpdateCardError = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.updateCardError,
  );

const makeSelectUpdateCardResponse = () =>
  createSelector(
    selectVerifyCardDomain,
    substate => substate.updateCardResponse,
  );

export {
  makeSelectVerifyCardLoading,
  makeSelectVerifyCardError,
  makeSelectVerifyCardResponse,
  makeSelectUpdateCardLoading,
  makeSelectUpdateCardResponse,
  makeSelectUpdateCardError
};
