/*
 * JobList Messages
 *
 * This contains all the text for the JobList container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.JobList';

export default defineMessages({
  createNew: {
    id: `${scope}.createNew`,
    defaultMessage: 'Create New Job',
  },
  openJob: {
    id: `${scope}.openJob`,
    defaultMessage: 'My Open Jobs',
  },
  closeJob: {
    id: `${scope}.closeJob`,
    defaultMessage: 'My Closed Jobs',
  },
  business: {
    id: `${scope}.business`,
    defaultMessage: 'Business Name',
  },
  contact: {
    id: `${scope}.contact`,
    defaultMessage: 'Contact Name',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: 'Role',
  },
  workType: {
    id: `${scope}.workType`,
    defaultMessage: 'Work Type',
  },
  shortlisted: {
    id: `${scope}.shortlisted`,
    defaultMessage: 'Shortlisted',
  },
  actions: {
    id: `${scope}.actions`,
    defaultMessage: 'Actions',
  },
  assignRecruiterSuccess: {
    id: `${scope}.assignRecruiterSuccess`,
    defaultMessage: 'Recruiter Assigned Successfully',
  },
  openJob: {
    id: `${scope}.openJob`,
    defaultMessage: 'Open Jobs',
  },
  closedJob: {
    id: `${scope}.closedJob`,
    defaultMessage: 'Closed Jobs',
  },
});
