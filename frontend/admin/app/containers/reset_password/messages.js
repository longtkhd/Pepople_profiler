/*
 * ResetPassword Messages
 *
 * This contains all the text for the ResetPassword container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ResetPassword';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ResetPassword container!',
  },
  newPass: {
    id: `${scope}.newPass`,
    defaultMessage: 'New password',
  },
  confirmNewPass: {
    id: `${scope}.confirmNewPass`,
    defaultMessage: 'Confirm new password',
  },
  resetPass: {
    id: `${scope}.resetPass`,
    defaultMessage: 'Reset password',
  },
  resetPasswordSuccess: {
    id: `${scope}.resetPasswordSuccess`,
    defaultMessage: 'Reset password successfully',
  },
  resetYourPassword: {
    id: `${scope}.resetYourPassword`,
    defaultMessage: 'Reset your password',
  },
  passwordRequired: {
    id: `${scope}.passwordRequired`,
    defaultMessage: 'Please enter password',
  },
  confirmPasswordRequired: {
    id: `${scope}.confirmPasswordRequired`,
    defaultMessage: 'Please enter confirmed password',
  },
  passwordDonotMatch: {
    id: `${scope}.passwordDonotMatch`,
    defaultMessage: 'Password don\'t match',
  },
  notification: {
    id: `${scope}.notification`,
    defaultMessage: 'Your token is not valid or has been expired.',
  },
});
