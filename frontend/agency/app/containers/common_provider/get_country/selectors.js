import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGetCountryDomain = state => state.getCountry || initialState;

const makeSelectGetCountryError = () =>
  createSelector(
    selectGetCountryDomain,
    substate => substate.error,
  );

const makeSelectGetCountryLoading = () =>
  createSelector(
    selectGetCountryDomain,
    substate => substate.loading,
  );

const makeSelectGetCountryResponse = () =>
  createSelector(
    selectGetCountryDomain,
    substate => substate.countries,
  );

export {
  makeSelectGetCountryLoading,
  makeSelectGetCountryError,
  makeSelectGetCountryResponse,
};
