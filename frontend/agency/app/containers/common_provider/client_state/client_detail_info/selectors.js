import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientDetailInfoState state domain
 */

const selectClientDetailInfoDomain = state =>
  state.clientDetailInfoState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by clientDetailInfoState
 */

const makeSelectClientDetailInfoLoad = () =>
  createSelector(
    selectClientDetailInfoDomain,
    substate => substate?.loading,
  );

const makeSelectClientDetailInfoResult = () =>
  createSelector(
    selectClientDetailInfoDomain,
    substate => substate?.result,
  );

export {
  makeSelectClientDetailInfoLoad,
  makeSelectClientDetailInfoResult,
};
