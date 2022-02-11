/*
 * RecruiterListPage Messages
 *
 * This contains all the text for the RecruiterListPage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.RecruiterListPage';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Recruiter List',
  },
  haveUsed: {
    id: `${scope}.haveUsed`,
    defaultMessage: 'Have used',
  },
  invite: {
    id: `${scope}.invite`,
    defaultMessage: 'Invite',
  },
  manualInvite: {
    id: `${scope}.manualInvite`,
    defaultMessage: 'Manual Invite',
  },
  importCSVFile: {
    id: `${scope}.importCSVFile`,
    defaultMessage: 'Import CSV File',
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
  openJobs: {
    id: `${scope}.openJobs`,
    defaultMessage: 'Open Jobs',
  },
  reInvite: {
    id: `${scope}.reInvite`,
    defaultMessage: 'Re-invite',
  },
});
