import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAddCandidateToJobDomain = state => state.addCandidateToJobState || initialState;

const makeSelectVisibleModal = () =>
  createSelector(
    selectAddCandidateToJobDomain,
    substate => substate?.visibleModal,
  );
const makeSelectLoading = () =>
  createSelector(
    selectAddCandidateToJobDomain,
    substate => substate?.loading,
  );
const makeSelectStatusAdd = () =>
  createSelector(
    selectAddCandidateToJobDomain,
    substate => substate?.statusAdd,
  );
const makeSelectError = () =>
  createSelector(
    selectAddCandidateToJobDomain,
    substate => substate?.error,
  );
const makeSelectKeyAdd = () =>
  createSelector(
    selectAddCandidateToJobDomain,
    substate => substate?.keyAdd,
  );



export {
  makeSelectVisibleModal,
  makeSelectLoading,
  makeSelectStatusAdd,
  makeSelectKeyAdd,
  makeSelectError
};
