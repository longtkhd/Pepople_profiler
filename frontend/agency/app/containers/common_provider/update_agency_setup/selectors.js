import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the update agency state domain
 */

const selectUpdateAgencyDomain = state => state.updateAgencySetup || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectUpdateAgencyLoading = () =>
  createSelector(
    selectUpdateAgencyDomain,
    substate => substate.loading,
  );


const makeSelectUpdateAgencyError = () =>
  createSelector(
    selectUpdateAgencyDomain,
    substate => substate.error,
  );

const makeSelectUpdateAgencyResponse = () =>
  createSelector(
    selectUpdateAgencyDomain,
    substate => substate.response,
  );

export { 
  makeSelectUpdateAgencyLoading,
  makeSelectUpdateAgencyError,
  makeSelectUpdateAgencyResponse,
};
