import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get recruiters state domain
 */

const selectGetAgencyInfoDomain = state => state.getAgencyInfoSetup || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Get Agency Info
 */

const makeSelectGetAgencyInfoLoading = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.agencyLoading,
  );

const makeSelectGetAgencyInfoError = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.agencyError,
  );

const makeSelectAgencyInfo = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.agencyInfo,
  );

const makeSelectGetCompanyLogoLoading = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.loadingLogo,
  );

const makeSelectGetCompanyLogoError = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.errorLogo,
  );

const makeSelectGetCompanyBackgroundLoading = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.loadingBackground,
  );

const makeSelectGetCompanyBackgroundError = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.errorBackground,
  );

const makeSelectCompanyLogoResponse = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.companyLogo,
  );

const makeSelectCompanyBackgroundResponse = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.companyBackground,
  );

export {
  makeSelectGetAgencyInfoLoading,
  makeSelectGetAgencyInfoError,
  makeSelectAgencyInfo,
  makeSelectCompanyLogoResponse,
  makeSelectCompanyBackgroundResponse,
  makeSelectGetCompanyLogoLoading,
  makeSelectGetCompanyLogoError,
  makeSelectGetCompanyBackgroundLoading,
  makeSelectGetCompanyBackgroundError
};
