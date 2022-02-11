import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the change password state domain
 */

const selectGetArgencyDomain = state => state.getArgency || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectGetArgencyLoading = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.loading,
  );

const makeSelectGetArgencyError = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.error,
  );

// const makeSelectChangePasswordSuccess = () =>
//     createSelector(
//         selectChangePasswordDomain,
//         substate => substate.success,
//     );
const makeSelectArgencyInfo = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.argencyData,
  );

const makeSelectAgencyById = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.agencyById,
  );

const makeSelectDeleteAgency = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.deleteStatus,
  );

const makeSelectDeleteAgencyError = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.error,
  );

const makeSelectDeactiveAgencySuccess = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.deactiveStatus,
  );

const makeSelectDeactiveAgencyError = () =>
  createSelector(
    selectGetArgencyDomain,
    substate => substate.deactiveError,
  );

export {
  makeSelectGetArgencyLoading,
  makeSelectGetArgencyError,
  makeSelectArgencyInfo,
  makeSelectAgencyById,
  makeSelectDeleteAgency,
  makeSelectDeleteAgencyError,
  makeSelectDeactiveAgencySuccess,
  makeSelectDeactiveAgencyError,
};
