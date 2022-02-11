/*
 * JobDashBoard Messages
 *
 * This contains all the text for the JobDashBoard container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.JobDashBoard';

export default defineMessages({
  jobInfo: {
    id: `${scope}.jonInfo`,
    defaultMessage: 'Job Info',
  },
  clientList: {
    id: `${scope}.clientList`,
    defaultMessage: 'Client List',
  },
  shortlisted: {
    id: `${scope}.shortlisted`,
    defaultMessage: 'Shortlisted Candidates',
  },
  recruitment: {
    id: `${scope}.recruitment`,
    defaultMessage: 'Recruitment Activity',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  closeJob: {
    id: `${scope}.closeJob`,
    defaultMessage: 'Close Job',
  },
  openJob: {
    id: `${scope}.openJob`,
    defaultMessage: 'Open Job',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  inviteAllClient: {
    id: `${scope}.inviteAllClient`,
    defaultMessage: 'Invite all client',
  },
  addNewClient: {
    id: `${scope}.addNewClient`,
    defaultMessage: 'Add new client',
  },
  exportPdf: {
    id: `${scope}.exportPdf`,
    defaultMessage: 'Export all candidates to PDF',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  invite: {
    id: `${scope}.invite`,
    defaultMessage: 'Invite',
  },
  inReview: {
    id: `${scope}.inReview`,
    defaultMessage: 'In review',
  },
  feedbackProvided: {
    id: `${scope}.feedbackProvided`,
    defaultMessage: 'Feedback Provided',
  },
  interview: {
    id: `${scope}.interview`,
    defaultMessage: 'Interview',
  },
  exclude: {
    id: `${scope}.exclude`,
    defaultMessage: 'exclude from report',
  },
  moreInfo: {
    id: `${scope}.moreInfo`,
    defaultMessage: "Content incorrect or missing? Simply click the 'Manage' button or click into the relevant field.",
  },
  addClient: {
    id: `${scope}.addClient`,
    defaultMessage: 'Add client',
  },
  addNewCandidate: {
    id: `${scope}.addNewCandidate`,
    defaultMessage: 'Add new candidate'
  }
});
