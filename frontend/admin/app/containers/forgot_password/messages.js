/*
 * FogotPassword Messages
 *
 * This contains all the text for the FogotPassword container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.FogotPassword';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the FogotPassword container!',
  },
   title: {
    id: `${scope}.title`,
    defaultMessage: 'Forgot you password?',
  },
  content: {
    id: `${scope}.content`,
    defaultMessage:
      'Don’t worry! Just fill in your email and we’ll send you a link to reset your password.',
  },
  resetPass: {
    id: `${scope}.resetPass`,
    defaultMessage: 'Reset password',
  },
  emailAddress: {
    id: `${scope}.emailAddress`,
    defaultMessage: 'Email address',
  },
  emailRequired: {
    id: `${scope}.emailRequired`,
    defaultMessage: 'Please enter email',
  },
  emailInvalid: {
    id: `${scope}.emailInvalid`,
    defaultMessage: 'Invalid email',
  },
  successNotification: {
    id: `${scope}.successNotification`,
    defaultMessage:
      'An email has been sent to your email to reset the password. Please check the mail inbox',
  },
  failNotification: {
    id: `${scope}.failNotification`,
    defaultMessage: 'Email not found',
  },
  
});
