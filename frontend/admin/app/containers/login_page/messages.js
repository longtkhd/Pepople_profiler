/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.LoginPage';

export default defineMessages({
  pageTitle: {
    id: `${scope}.pageTitle`,
    defaultMessage: 'Login Page',
  },
  welcome: {
    id: `${scope}.welcome`,
    defaultMessage: 'Welcome to People Profiler',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Fast, beautiful, and insightful candidate summary reports, to help you make the best hiring decisions.',
  },
  welcomeBack: {
    id: `${scope}.welcomeBack`,
    defaultMessage: 'Welcome back',
  },
  createAccount: {
    id: `${scope}.createAccount`,
    defaultMessage: 'Create Account',
  },
  loginError: {
    title: {
      id: `${scope}.title`,
      defaultMessage: 'Oops, incorrect login credentials ',
    },
    content: {
      id: `${scope}.content`,
      defaultMessage: 'Please double check your email and password and try again',
    }
  }
});
