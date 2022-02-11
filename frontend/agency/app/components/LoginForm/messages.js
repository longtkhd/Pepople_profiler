/*
 * LoginForm Messages
 *
 * This contains all the text for the LoginForm components.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.compoents.LoginForm';

export default defineMessages({
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  rememberMe: {
    id: `${scope}.rememberMe`,
    defaultMessage: 'Remember me',
  },
  forgotPassword: {
    id: `${scope}.forgotPassword`,
    defaultMessage: 'Forgot password?',
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: 'Login',
  },
  emailRequired: {
    id: `${scope}.emailRequired`,
    defaultMessage: 'Please enter email',
  },
  passwordRequired: {
    id: `${scope}.passwordRequired`,
    defaultMessage: 'Please enter password',
  },
  emailInvalid: {
    id: `${scope}.password`,
    defaultMessage: 'Invalid email',
  },
});
