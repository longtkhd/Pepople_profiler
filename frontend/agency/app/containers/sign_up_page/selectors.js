import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the signUpPage state domain
 */

const selectSignUpPageDomain = state => state.signUpPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SignUpPage
 */

const makeSelectLoading = () =>
  createSelector(
    selectSignUpPageDomain,
    substate => substate.loading,
  );


const makeSelectError = () =>
  createSelector(
    selectSignUpPageDomain,
    substate => substate.error,
  );

const makeSelectAgency = () =>
  createSelector(
    selectSignUpPageDomain,
    substate => substate.agency,
  );

  
const makeSelectShowVerify = () =>
  createSelector(
    selectSignUpPageDomain,
    substate => substate.showVerify,
  );



export { 
  selectSignUpPageDomain,
  makeSelectLoading,
  makeSelectError,
  makeSelectShowVerify,
  makeSelectAgency,
};
