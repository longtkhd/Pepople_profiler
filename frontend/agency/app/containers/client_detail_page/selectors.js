import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the clientDetailPage state domain
 */

const selectClientDetailPageDomain = state =>
  state.clientDetailPage || initialState;

const selectClientStateDomain = state => state.clientState || initialState;

const selectJobStateDomain = state => state.jobListState || initialState;

const selectDeleteContactDetailDomain = state => state.deleteContactDetail || initialState;
/**
 * Other specific selectors
 */

/**
 * Default selector used by ClientDetailPage
 */
// CLient
const makeSelectClientDetailPage = () =>
  createSelector(
    selectClientDetailPageDomain,
    substate => substate,
  );
const makeSelectResultClientDetail = () =>
  createSelector(
    selectClientDetailPageDomain,
    substate => substate?.clientDetail?.result,
  );
const makeSelectClientDetaiLoading = () =>
  createSelector(
    selectClientDetailPageDomain,
    substate => substate?.clientDetail?.loading,
  );
// Contact
const makeSelectContactListDetail = () =>
  createSelector(
    selectClientStateDomain,
    substate => substate?.contactListDetail?.result?.data,
  );
  const makeSelectContactListDetailLoad = () =>
  createSelector(
    selectClientStateDomain,
    substate => substate?.contactListDetail?.loading,
    );
// JOB
const makeSelectGetJobList = () =>
  createSelector(
    selectJobStateDomain,
    substate => substate?.jobList?.data?.job_list,
  );

const makeSelectJobListLoad = () =>
  createSelector(
    selectJobStateDomain,
    substate => substate?.loading,
  );

const makeSelectDeleteContactDetailSuccess = () =>
  createSelector(
    selectDeleteContactDetailDomain,
    substate => substate?.result?.success,
);

const makeSelectDeleteContactDetailLoading = () =>
  createSelector(
    selectDeleteContactDetailDomain,
    substate => substate?.loading,
);

export default makeSelectClientDetailPage;
export {
  selectClientDetailPageDomain,
  makeSelectResultClientDetail,
  makeSelectClientDetaiLoading,
  makeSelectContactListDetail,
  makeSelectContactListDetailLoad,
  makeSelectGetJobList,
  makeSelectJobListLoad,
  makeSelectDeleteContactDetailSuccess,
  makeSelectDeleteContactDetailLoading
};
