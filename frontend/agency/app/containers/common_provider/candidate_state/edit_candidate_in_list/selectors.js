import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEditCandidateDomain = state => state.editCandidateState || initialState;

const makeSelectEditCandidateResult = () =>
  createSelector(
    selectEditCandidateDomain,
    substate => substate?.result,
  );

const makeSelectEditCandidateLoad = () =>
  createSelector(
    selectEditCandidateDomain,
    substate => substate?.loading,
  );


const makeSelectSaveReportForm = () =>
  createSelector(
    selectEditCandidateDomain,
    substate => substate?.saveReportForm,
  );


export {
  makeSelectEditCandidateResult,
  makeSelectEditCandidateLoad,
  makeSelectSaveReportForm,
};
