import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the jobDashBoard state domain
 */

const selectJobDashBoardDomain = state => state.jobDashBoard || initialState;

const selectJobDetailState = state => state.jobDetailState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by JobDashBoard
 * 
 */

const makeSelectJobDashBoard = () =>
  createSelector(
    selectJobDashBoardDomain,
    substate => substate,
  );

const makeSelectJobDetail = () =>
  createSelector(
    selectJobDetailState,
    substate => substate?.jobDetail?.data,
  );

const makeSelectJobDetailLoading = () =>
  createSelector(
    selectJobDetailState,
    substate => substate?.loading,
  );

export default makeSelectJobDashBoard;
export { selectJobDashBoardDomain, makeSelectJobDetail, makeSelectJobDetailLoading };
