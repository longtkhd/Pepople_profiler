import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the subscriptionSumary state domain
 */

const selectSubscriptionSumaryDomain = state =>
  state.subscriptionSumaryState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SubscriptionSumary
 */

const makeSelectSubscriptionSumary = () =>
  createSelector(
    selectSubscriptionSumaryDomain,
    substate => substate,
  );

const makeSelectSubscriptionSumaryInfo = () =>
  createSelector(
    selectSubscriptionSumaryDomain,
    substate => substate.response,
  );


export {
  makeSelectSubscriptionSumary,
  makeSelectSubscriptionSumaryInfo
};
