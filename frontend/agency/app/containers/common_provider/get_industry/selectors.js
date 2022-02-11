import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGetIndustryDomain = state => state.getIndustry || initialState;

const makeSelectGetIndustryError = () =>
  createSelector(
    selectGetIndustryDomain,
    substate => substate.error,
  );

const makeSelectGetIndustryLoading = () =>
  createSelector(
    selectGetIndustryDomain,
    substate => substate.loading,
  );

const makeSelectGetIndustryResponse = () =>
  createSelector(
    selectGetIndustryDomain,
    substate => substate.industries,
  );

export {
  makeSelectGetIndustryLoading,
  makeSelectGetIndustryError,
  makeSelectGetIndustryResponse,
};
