/*
 * SelectRecruiterModal Messages
 *
 * This contains all the text for the SelectRecruiterModal component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SelectRecruiterModal';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Select Recruiter',
  },
  firstName: {
    id: `${scope}.firstName`,
    defaultMessage: 'First Name',
  },
  lastName: {
    id: `${scope}.lastName`,
    defaultMessage: 'Last Name',
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: 'Role',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  contact: {
    id: `${scope}.contact`,
    defaultMessage: 'Contact',
  },
});
