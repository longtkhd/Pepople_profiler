import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the joinPage state domain
 */

const selectJoinPageDomain = state => state.joinPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by JoinPage
 */

const makeSelectJoinPage = () =>
  createSelector(
    selectJoinPageDomain,
    substate => substate,
  );

const makeSelectRecruiterInfo = () =>
  createSelector(
    selectJoinPageDomain,
    substate => substate?.recruiterInfo?.data,
  );

const makeSelectEditRecruiterInfo = () =>
  createSelector(
    selectJoinPageDomain,
    substate => substate?.editPersonal,
  );

const makeSelectCreatePasswordResponse = () =>
  createSelector(
    selectJoinPageDomain,
    substate => substate?.createPassResponse,
  );

const makeSelectCreatePasswordError = () =>
  createSelector(
    selectJoinPageDomain,
    substate => substate?.createPassError,
  );


export default makeSelectJoinPage;
export { 
  selectJoinPageDomain, 
  makeSelectRecruiterInfo, 
  makeSelectEditRecruiterInfo,
  makeSelectCreatePasswordResponse,
  makeSelectCreatePasswordError,
};
