/*
 * ForgotPassword Messages
 *
 * This contains all the text for the ForgotPassword container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ForgotPass';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Forgot your password?',
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
      'A password reset link has been sent to your email address.',
  },
  failNotification: {
    id: `${scope}.failNotification`,
    defaultMessage: 'Email not found',
  },
});
