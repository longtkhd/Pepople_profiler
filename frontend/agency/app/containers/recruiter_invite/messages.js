/*
 * RecruiterInvite Messages
 *
 * This contains all the text for the RecruiterInvite container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.RecruiterInvite';

export default defineMessages({
  inviteRecruiter: {
    id: `${scope}.inviteRecruiter`,
    defaultMessage: 'Invite recruiter',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  invite: {
    id: `${scope}.invite`,
    defaultMessage: 'Invite',
  },
  firstName: {
    id: `${scope}.firstName`,
    defaultMessage: 'First Name',
  },
  lastName: {
    id: `${scope}.lastName`,
    defaultMessage: 'Last Name',
  },
  contactNumber: {
    id: `${scope}.contactNumber`,
    defaultMessage: 'Contact Number',
  },
  jobTitle: {
    id: `${scope}.jobTitle`,
    defaultMessage: 'Job Title',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  action: {
    id: `${scope}.action`,
    defaultMessage: 'Actions',
  },
  maxRecruiterTitle: {
    id: `${scope}.maxRecruiterTitle`,
    defaultMessage: 'Max recruiter error!',
  },
  maxRecruiterContent: {
    id: `${scope}.maxRecruiterContent`,
    defaultMessage: 'You subscription plan reached to max recruiter, please upgrade your subscription plan for inviting more people.',
  }
});
