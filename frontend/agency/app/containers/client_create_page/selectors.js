import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientCreatePage state domain
 */

const selectClientCreatePageDomain = state =>
  state.clientCreatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ClientCreatePage
 */

const makeSelectClientCreatePage = () =>
  createSelector(
    selectClientCreatePageDomain,
    substate => substate,
  );
const makeSelectCreateSuccess = () =>
  createSelector(
    selectClientCreatePageDomain,
    substate => substate?.result?.success
  );
const makeSelectClientCreatedResult = () =>
  createSelector(
    selectClientCreatePageDomain,
    substate => substate?.result
  );

export default makeSelectClientCreatePage;
export { selectClientCreatePageDomain, makeSelectCreateSuccess, makeSelectClientCreatedResult};
