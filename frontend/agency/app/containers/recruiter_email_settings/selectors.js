import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterEmailSettings state domain
 */

const selectRecruiterEmailSettingsDomain = state =>
  state.recruiterEmailSettings || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterEmailSettings
 */

const makeSelectRecruiterEmailSettings = () =>
  createSelector(
    selectRecruiterEmailSettingsDomain,
    substate => substate,
  );

const makeSelectRecruiterMailTemplateResponse = () =>
  createSelector(
    selectRecruiterEmailSettingsDomain,
    substate => substate.response,
  );

const makeSelectDeleteMailTemplate = () =>
  createSelector(
    selectRecruiterEmailSettingsDomain,
    substate => substate.deleteStatus,
  );

const makeSelectDeleteMailTemplateError = () =>
  createSelector(
    selectRecruiterEmailSettingsDomain,
    substate => substate.deleteError,
  );




export {
  makeSelectRecruiterEmailSettings,
  makeSelectRecruiterMailTemplateResponse,
  makeSelectDeleteMailTemplate,
  makeSelectDeleteMailTemplateError
};
