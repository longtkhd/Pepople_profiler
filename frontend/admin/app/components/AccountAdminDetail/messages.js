/*
 * AgencyDetails Messages
 *
 * This contains all the text for the AgencyDetails component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AgencyDetails';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AgencyDetails component!',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Account Admin',
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
  contactNumber: {
    id: `${scope}.contactNumber`,
    defaultMessage: 'Contact Number',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
});
