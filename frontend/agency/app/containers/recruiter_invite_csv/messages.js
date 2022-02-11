/*
 * RecruiterInviteCsv Messages
 *
 * This contains all the text for the RecruiterInviteCsv container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.RecruiterInviteCsv';

export default defineMessages({
  inviteRecruiterCSV: {
    id: `${scope}.inviteRecruiterCSV`,
    defaultMessage: 'Invite recruiter list with file .csv',
  },
  firstName: {
    id: `${scope}.firstName`,
    defaultMessage: 'First Name',
  },
  lastName: {
    id: `${scope}.lastName`,
    defaultMessage: 'Last Name',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  jobTitle: {
    id: `${scope}.jobTitle`,
    defaultMessage: 'Job Title',
  },
  contactNumber: {
    id: `${scope}.contactNumber`,
    defaultMessage: 'Contact Number',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  invite: {
    id: `${scope}.invite`,
    defaultMessage: 'Invite',
  },
});
