import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sendMailAssessment state domain
 */

const selectSendMailAssessmentDomain = state =>
  state.sendMailAssessmentState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SendMailAssessment
 */

const makeSelectSendMailAssessmentLoading = () =>
  createSelector(
    selectSendMailAssessmentDomain,
    substate => substate.loading,
  );

const makeSelectSendMailAssessmentSuccess = () =>
  createSelector(
    selectSendMailAssessmentDomain,
    substate => substate.sent,
  );

const makeSelectSendMailAssessmentError = () =>
  createSelector(
    selectSendMailAssessmentDomain,
    substate => substate.error,
  );

export {
  makeSelectSendMailAssessmentError,
  makeSelectSendMailAssessmentLoading,
  makeSelectSendMailAssessmentSuccess
};
