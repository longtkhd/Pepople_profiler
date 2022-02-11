import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inviteAssessmentEmail state domain
 */

const selectInviteAssessmentEmailDomain = state =>
  state.inviteAssessmentEmail || initialState;



/**
 * Other specific selectors
 */

/**
 * Default selector used by InviteAssessmentEmail
 */

const makeSelectInviteAssessmentEmail = () =>
  createSelector(
    selectInviteAssessmentEmailDomain,
    substate => substate,
  );

 
  const makeSelectInviteAssessmentEmailSuccess = () =>
  createSelector(
    selectInviteAssessmentEmailDomain,
    substate => substate.response,
  );

  const makeSelectInviteAssessmentEmailInfoSuccess = () =>
  createSelector(
    selectInviteAssessmentEmailDomain,
    substate => substate.DataById,
  );

    const makeSelectAddEmailTemplateSuccess = () =>
        createSelector(
          selectInviteAssessmentEmailDomain,
          substate => substate.success,
            );

  const makeSelectAddEmailTemplateError = () =>
  createSelector(
    selectInviteAssessmentEmailDomain,
    substate => substate.error,
    );
      
     const makeSelectSendEmailTemplateSuccess = () =>
          createSelector(
          selectInviteAssessmentEmailDomain,
          substate => substate.sent?.success,
      );
  
      





export {
  makeSelectInviteAssessmentEmail,
  makeSelectInviteAssessmentEmailSuccess,
  makeSelectInviteAssessmentEmailInfoSuccess,
  makeSelectAddEmailTemplateSuccess,
  makeSelectAddEmailTemplateError,
  makeSelectSendEmailTemplateSuccess
};
