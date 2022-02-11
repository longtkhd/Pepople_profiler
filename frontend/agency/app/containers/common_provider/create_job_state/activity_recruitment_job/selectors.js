import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the deleteJobState state domain
 */

const selectSaveRecruitmentActivityDomain = state =>
  state.saveRecruitmentActivityState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by deleteJobState
 */

const makeSelectSaveRecruitmentActivityResult  = () =>
  createSelector(
    selectSaveRecruitmentActivityDomain,
    substate => substate?.result
  );

  const makeSelectSaveRecruitmentActivityLoad = () =>
  createSelector(
    selectSaveRecruitmentActivityDomain,
    substate => substate?.loading
  );

export { makeSelectSaveRecruitmentActivityLoad, makeSelectSaveRecruitmentActivityResult  };
