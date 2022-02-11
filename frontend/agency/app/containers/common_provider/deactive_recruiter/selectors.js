import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGetCountryDomain = state => state.deactiveRecruiter || initialState;

const makeSelectDeactiveRecruiterLoading = () =>
  createSelector(
    selectGetCountryDomain,
    substate => substate.loading,
  );

const makeSelectDeactiveRecruiterResponse = () =>
  createSelector(
    selectGetCountryDomain,
    substate => substate.response,
  );

const makeSelectDeactiveRecruiterError = () =>
  createSelector(
    selectGetCountryDomain,
    substate => substate.error,
  );

export {
  makeSelectDeactiveRecruiterLoading,
  makeSelectDeactiveRecruiterResponse,
  makeSelectDeactiveRecruiterError,
};
