import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGetPackageDomain = state => state.getPackage || initialState;

const makeSelectGetPackageError = () =>
  createSelector(
    selectGetPackageDomain,
    substate => substate.error,
  );

const makeSelectGetPackageLoading = () =>
  createSelector(
    selectGetPackageDomain,
    substate => substate.loading,
  );

const makeSelectGetPackageSuccess = () =>
  createSelector(
    selectGetPackageDomain,
    substate => substate.packageList,
  );

export {
  makeSelectGetPackageLoading,
  makeSelectGetPackageError,
  makeSelectGetPackageSuccess,
};
