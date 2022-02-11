import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruiterSettingOptions state domain
 */

const selectRecruiterSettingOptionsDomain = state =>
  state.recruiterSettingOptions || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruiterSettingOptions
 */

const makeSelectRecruiterSettingOptions = () =>
  createSelector(
    selectRecruiterSettingOptionsDomain,
    substate => substate,
  );

export default makeSelectRecruiterSettingOptions;
export { selectRecruiterSettingOptionsDomain };
