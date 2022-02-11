import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createNewJobDetail state domain
 */

const selectCreateNewJobDetailDomain = state =>
  state.createNewJobDetail || initialState;

const selectJobDetailState = state => state.jobDetailState || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateNewJobDetail
 */

const makeSelectCreateNewJobDetail = () =>
  createSelector(
    selectCreateNewJobDetailDomain,
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
export default makeSelectCreateNewJobDetail;
export { selectCreateNewJobDetailDomain, makeSelectJobDetail, makeSelectJobDetailLoading };
