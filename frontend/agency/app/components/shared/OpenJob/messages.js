/*
 * OpenJob Messages
 *
 * This contains all the text for the OpenJob component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.OpenJob';

export default defineMessages({
  statusTag: {
    progress: {
      id: `${scope}.status.progress`,
      defaultMessage: 'Profile in progress',
    },
    submitted: {
      id: `${scope}.status.submitted`,
      defaultMessage: 'Profile submitted',
    },
    received: {
      id: `${scope}.status.received`,
      defaultMessage: 'Client feedback received',
    }
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
    defaultMessage: 'Recruiter assigned to jobs successfully',
  },
  closeModalTitle: {
    id: `${scope}.closeModalTitle`,
    defaultMessage: 'Are you sure?',
  },
  closeModalButton: {
    id: `${scope}.closeModalButton`,
    defaultMessage: 'Close',
  },
  closeModalContent: {
    id: `${scope}.closeModalContent`,
    defaultMessage: 'Are you sure you want to close this job?',
  },
});
