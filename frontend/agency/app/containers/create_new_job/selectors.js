import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createNewJob state domain
 */

const selectCreateNewJobDomain = state => state.createNewJob || initialState;

const selectClientState = state => state.clientState || initialState;


const selectCreateJobState = state => state.createJobState || initialState;
/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateNewJob
 */

const makeSelectCreateNewJob = () =>
  createSelector(
    selectCreateNewJobDomain,
    substate => substate,
  );
const makeSelectClientState = () =>
  createSelector(
    selectClientState,
    substate => substate,
  );
const makeSelectClientList = () =>
  createSelector(
    selectClientState,
    substate => substate?.clientData?.data,
  );
const makeSelectContactList = () =>
  createSelector(
    selectCreateJobState,
    substate => substate?.contactList,
  );
const makeSelectContactDetail = () =>
  createSelector(
    selectCreateJobState,
    substate => substate?.contactDetail,
  );

const makeSelectCreateResult = () =>
  createSelector(
  selectCreateJobState,
  substate => substate?.result,
);

const makeSelectCreateLoading = () =>
  createSelector(
  selectCreateJobState,
  substate => substate?.loading,
);



export default makeSelectCreateNewJob;
export {
  selectCreateNewJobDomain,
  makeSelectClientState,
  makeSelectClientList,
  makeSelectContactList,
  makeSelectContactDetail,
  makeSelectCreateResult,
  makeSelectCreateLoading
};
