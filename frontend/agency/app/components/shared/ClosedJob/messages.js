/*
 * CloseJob Messages
 *
 * This contains all the text for the CloseJob component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CloseJob';

export default defineMessages({
  statusTag: {
    closed: {
      id: `${scope}.status.closed`,
      defaultMessage: 'Closed',
    },
  },
  businessName: {
    id: `${scope}.businessName`,
    defaultMessage: 'Business name',
  },
  personInCharge: {
    id: `${scope}.personInCharge`,
    defaultMessage: 'Person in charge',
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
  closeRole: {
    id: `${scope}.closeRole`,
    defaultMessage: 'Close Role',
  },
  assignTo: {
    id: `${scope}.assignTo`,
    defaultMessage: 'Assign To',
  },
  assignRecruiterSuccess: {
    id: `${scope}.assignRecruiterSuccess`,
    defaultMessage: 'Assign Recruiter Successfully',
  },
  reactive: {
    id: `${scope}.reactive`,
    defaultMessage: 'Re-active',
  },
  reactiveModalTitle: {
    id: `${scope}.reactiveModalTitle`,
    defaultMessage: 'Are you sure?',
  },
  reactiveModalButton: {
    id: `${scope}.reactiveModalButton`,
    defaultMessage: 'Reactivate',
  },
  reactiveModalContent: {
    id: `${scope}.reactiveModalContent`,
    defaultMessage: 'Are you sure you want to reactivate this job?',
  },
});
