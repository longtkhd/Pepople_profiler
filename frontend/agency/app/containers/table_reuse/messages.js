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
  actions: {
    id: `${scope}.actions`,
    defaultMessage: 'Actions',
  },
  jobInfo: {
    id: `${scope}.jonInfo`,
    defaultMessage: 'Job Info',
  },
  clientList: {
    id: `${scope}.clientList`,
    defaultMessage: 'Contact List',
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
  inviteAllClient: {
    id: `${scope}.inviteAllClient`,
    defaultMessage: 'Invite all contacts',
  },
  revokeAllClient: {
    id: `${scope}.revokeAllClient`,
    defaultMessage: 'Revoke ALL',
  },
  addNewClient: {
    id: `${scope}.addNewClient`,
    defaultMessage: 'Add new contact',
  },
  clientInvitedSuccess: {
    id: `${scope}.clientInvitedSuccess`,
    defaultMessage: 'Client invited successfully',
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
  yes: {
    id: `${scope}.yes`,
    defaultMessage: 'Invite',
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
  interviewTime: {
    id: `${scope}.interviewTime`,
    defaultMessage: 'Interview Time',
  },
  exclude: {
    id: `${scope}.exclude`,
    defaultMessage: 'exclude from PDF report & client dashboard',
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
  },
  saveAndSubmit: {
    id: `${scope}.saveAndSubmit`,
    defaultMessage: 'Save & Submit'
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add'
  },
  modalTitleFeedback: {
    id: `${scope}.modalTitleFeedback`,
    defaultMessage: 'Feedback from '
  },
  btnClose: {
    id: `${scope}.btnClose`,
    defaultMessage: 'Close'
  },
  interested: {
    id: `${scope}.interested`,
    defaultMessage: 'Interested'
  },
  discuss: {
    id: `${scope}.discuss`,
    defaultMessage: 'Les\'t discuss'
  },
  modalInviteTitle: {
    id: `${scope}.modalInviteTitle`,
    defaultMessage: 'Ready to go?'
  },
  modalRevokeTitle: {
    id: `${scope}.modalRevokeTitle`,
    defaultMessage: 'Are you sure?'
  },
  areYouSure: {
    id: `${scope}.areYouSure`,
    defaultMessage: 'Are you sure?'
  },
  download_activity_report: {
    id: `${scope}.download_activity_report`,
    defaultMessage: 'Download the recruitment activity report',
  },
  excludeFromReportContent: {
    id: `${scope}.excludeFromReportContent`,
    defaultMessage: 'Are you sure you want to exclude the recruitment activity table from the report? Your client won\'t get see all the hard work you\'ve been doing.'
  },
  modalInviteAll: {
    id: `${scope}.modalInviteAll`,
    defaultMessage: 'Before inviting for all clients, please review all shortlisted candidates to ensure all information is completed and accurate.'
  },
  modalRevokeAll: {
    id: `${scope}.modalRevokeAll`,
    defaultMessage: 'Are you sure you want to revoke the invitation for all clients? This will remove the client access to the shortlisted candidates.'
  },
  modalRevoke: {
    id: `${scope}.modalRevoke`,
    defaultMessage: 'Are you sure you want to revoke the invitation for this client? This will remove the client access to the shortlisted candidates.'
  },
  modalInvite: {
    id: `${scope}.modalInvite`,
    defaultMessage: 'Before inviting the client, please review all shortlisted candidates to ensure all information is completed and accurate.'
  },
  buttonInvite: {
    id: `${scope}.buttonInvite`,
    defaultMessage: 'Invite'
  },
  buttonRevoke: {
    id: `${scope}.buttonRevoke`,
    defaultMessage: 'Yes, revoke'
  },
  recruitmentActivitySuccess: {
    id: `${scope}.recruitmentActivitySuccess`,
    defaultMessage: 'Recruitment activity updated'
  },
  revokeContactSuccess: {
    id: `${scope}.revokeContactSuccess`,
    defaultMessage: 'Contact revoked successfully'
  },
});
