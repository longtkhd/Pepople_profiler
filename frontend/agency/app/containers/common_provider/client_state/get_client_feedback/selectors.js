import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the Client feedback state domain
 */

const selectClientFeedbackDomain = state => state.getClientFeedback || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Test
 */

const makeSelectClientFeedbackLoading = () =>
  createSelector(
    selectClientFeedbackDomain,
    substate => substate.loading,
  );

const makeSelectClientFeedbackSuccess = () =>
  createSelector(
    selectClientFeedbackDomain,
    substate => substate.feedback,
  );

export { makeSelectClientFeedbackSuccess, makeSelectClientFeedbackLoading };
