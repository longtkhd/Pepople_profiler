import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientListPage state domain
 */

const selectClientListPageDomain = state =>
  state.clientListPage || initialState;

const selectClientDataDomain = state => state.clientState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClientListPage
 */

const makeSelectClientListPage = () =>
  createSelector(
    selectClientListPageDomain,
    substate => substate,
  );
const makeSelectClientList = () =>
  createSelector(
    selectClientDataDomain,
    substate => substate,
  );

const makeSelectClientData = () =>
  createSelector(
    selectClientDataDomain,
    substate => substate?.clientData?.data?.client_list,
  );

const makeSelectListClientTotal = () =>
  createSelector(
    selectClientDataDomain,
    substate => substate?.clientData?.data?.total,
  );

const makeSelectListClientLoading = () =>
  createSelector(
    selectClientDataDomain,
    substate => substate?.loading,
  );
export default makeSelectClientListPage;
export {
  selectClientListPageDomain,
  makeSelectClientList,
  makeSelectClientData,
  makeSelectListClientTotal,
  makeSelectListClientLoading,
};
