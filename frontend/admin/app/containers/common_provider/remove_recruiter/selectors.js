import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterListPage state domain
 */

const selectRemoveRecruiterDomain = state =>
  state.removeRecruiter || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterListPage
 */

const makeSelectRemoveRecruiterLoading = () =>
  createSelector(
    selectRemoveRecruiterDomain,
    substate => substate.loading,
  );

const makeSelectRemoveRecruiterError = () =>
  createSelector(
    selectRemoveRecruiterDomain,
    substate => substate.error,
  );

const makeSelectRemoveRecruiterResponse = () =>
  createSelector(
    selectRemoveRecruiterDomain,
    substate => substate.deleteRecruiterResponse,
  );

export { 
  makeSelectRemoveRecruiterLoading,
  makeSelectRemoveRecruiterError,
  makeSelectRemoveRecruiterResponse,
};
