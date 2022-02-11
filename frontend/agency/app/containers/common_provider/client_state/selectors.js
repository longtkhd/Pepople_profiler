import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create client state domain
 */

const selectClientStateDomain = state => state.clientState || initialState;
/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectClientData = () =>
  createSelector(
    selectClientStateDomain,
    substate => substate?.clientData?.data,
  );

const makeSelectContactListDetail = () =>
  createSelector(
    selectClientStateDomain,
    substate => substate?.contactListDetail?.result?.data,
  );
const makeSelectContactListDetailLoad = () =>
  createSelector(
    selectClientStateDomain,
    substate => substate?.contactListDetail?.loading,
  );

export {
  makeSelectClientData,
  makeSelectContactListDetail,
  makeSelectContactListDetailLoad,
};
