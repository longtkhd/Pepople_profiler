import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create client state domain
 */

const selectClientDomain = state => state.clientData || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectClient = () =>
  createSelector(
    selectClientDomain,
    substate => substate,
  );


export {
  makeSelectClient,
};
