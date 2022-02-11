import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the create client state domain
 */

const selectCandidateDomain = state => state.candidateState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Update Agency
 */

const makeSelectCandidateState = () =>
  createSelector(
    selectCandidateDomain,
    substate => substate,
  );


export {
  makeSelectCandidateState,
};
