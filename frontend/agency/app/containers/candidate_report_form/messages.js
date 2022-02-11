/*
 * CandidateReportForm Messages
 *
 * This contains all the text for the CandidateReportForm container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CandidateReportForm';

export default defineMessages({
  candidateSummary: {
    id: `${scope}.candidateSummary`,
    defaultMessage: 'Candidate Summary',
  },
  recruiterAssessment: {
    id: `${scope}.recruiterAssessment`,
    defaultMessage: 'Recruiter Assessment',
  },
  candidateAandR: {
    id: `${scope}.candidateAandR`,
    defaultMessage: 'Candidate Personality Assessment',
  },
  BackgroundCheck: {
    id: `${scope}.BackgroundCheck`,
    defaultMessage: 'Background Check',
  },
  rightToWork: {
    id: `${scope}.rightToWork`,
    defaultMessage: 'Right To Work',
  },
  applyCompetencies: {
    id: `${scope}.applyCompetencies`,
    defaultMessage:
      'Apply competencies to all shortlisted candidates for this job role.',
  },
  linkedlnRecommend: {
    id: `${scope}.linkedlnRecommend`,
    defaultMessage: 'Linkedln Recommendations',
  },
  candidateResume: {
    id: `${scope}.candidateResume`,
    defaultMessage: 'Candidate Resume',
  },
  additionalCandidateInformation: {
    id: `${scope}.additionalCandidateInformation`,
    defaultMessage: 'Additional Candidate Information',
  },
  modalInviteTitle: {
    id: `${scope}.modalInviteTitle`,
    defaultMessage: 'Invite Assessment',
  },
  modalInvite: {
    id: `${scope}.modalInvite`,
    defaultMessage:
      'Are you sure to invite the candidate to complete the assessment? \n Please save your progress before leaving the page.',
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
    defaultMessage: 'Yes',
  },
  modalRemindTitle: {
    id: `${scope}.modalRemindTitle`,
    defaultMessage: 'Are you sure?',
  },
  modalRemindContent: {
    id: `${scope}.modalRemindContent`,
    defaultMessage:
      'Are you sure you want to send this reminder to the candidate?',
  },
  profileAssessment: {
    id: `${scope}.profileAssessment`,
    defaultMessage: 'TPAQ-27 Express Personality Profile',
  },
  confirmRemoveTitle: {
    id: `${scope}.confirmRemoveTitle`,
    defaultMessage: 'Are you sure?'
  },
  confirmRemoveMessage: {
    id: `${scope}.confirmRemoveMessage`,
    defaultMessage: 'Are you sure you want to delete this document?'
  },
  buttonRemove: {
    id: `${scope}.buttonRemove`,
    defaultMessage: 'Remove'
  },
});
