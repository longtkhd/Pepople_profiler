/*
 * JoinPage Messages
 *
 * This contains all the text for the JoinPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.JoinPage';

export default defineMessages({
  one: {
    id: `${scope}.one`,
    defaultMessage: '1. Personal Details',
  },
  two: {
    id: `${scope}.two`,
    defaultMessage: '2. Create Password',
  },
  heading: {
    id: `${scope}.heading`,
    defaultMessage: 'Please confirm your personal details',
  },
  heading2: {
    id: `${scope}.heading2`,
    defaultMessage: 'Create your password',
  },
  firstName: {
    id: `${scope}.firstName`,
    defaultMessage: 'First Name',
  },
  lastName: {
    id: `${scope}.lastName`,
    defaultMessage: 'Last Name',
  },
  jobTitle: {
    id: `${scope}.jobTitle`,
    defaultMessage: 'Job Title',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  phoneNumber: {
    id: `${scope}.phoneNumber`,
    defaultMessage: 'Phone Number',
  },
  createPasswordSuccess: {
    id: `${scope}.createPasswordSuccess`,
    defaultMessage: 'Password created successfully',
  },
});
