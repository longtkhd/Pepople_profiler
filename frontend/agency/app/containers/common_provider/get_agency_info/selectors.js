import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the get recruiters state domain
 */

const selectGetAgencyInfoDomain = state => state.getAgencyInfo || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Get Agency Info
 */

const makeSelectGetAgencyInfoLoading = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.loadingAgency,
  );

const makeSelectGetAgencyInfoError = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.errorAgency,
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

const makeSelectAgencyInfo = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.agencyInfo,
  );

const makeSelectCompanyLogoSuccess = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.companyLogo,
  );

const makeSelectCompanyBackgroundSuccess = () =>
  createSelector(
    selectGetAgencyInfoDomain,
    substate => substate.companyBackground,
  );

export {
  makeSelectGetAgencyInfoLoading,
  makeSelectGetAgencyInfoError,
  makeSelectAgencyInfo,
  makeSelectCompanyLogoSuccess,
  makeSelectCompanyBackgroundSuccess,
  makeSelectGetCompanyLogoLoading,
  makeSelectGetCompanyLogoError,
  makeSelectGetCompanyBackgroundLoading,
  makeSelectGetCompanyBackgroundError
};
