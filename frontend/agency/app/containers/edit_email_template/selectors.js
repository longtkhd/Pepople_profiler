import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editEmailTemplate state domain
 */

const selectEditEmailTemplateDomain = state =>
  state.editEmailTemplate || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by EditEmailTemplate
 */

const makeSelectEditEmailTemplate = () =>
  createSelector(
    selectEditEmailTemplateDomain,
    substate => substate,
  );

const makeSelectEditMailTemplateResponse = () =>
  createSelector(
    selectEditEmailTemplateDomain,
    substate => substate.response,
  );

const makeSelectEditMailTemplateError = () =>
  createSelector(
    selectEditEmailTemplateDomain,
    substate => substate.error,
  );


const makeSelectGetMailTemplateById = () =>
  createSelector(
    selectEditEmailTemplateDomain,
    substate => substate.mailTemplateInfo,
  );












export {
  makeSelectEditEmailTemplate,
  makeSelectEditMailTemplateResponse,
  makeSelectGetMailTemplateById,
  makeSelectEditMailTemplateError,

};
