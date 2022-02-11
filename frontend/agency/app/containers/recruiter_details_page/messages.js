/*
 * RecruiterDetails Messages
 *
 * This contains all the text for RecruiterDetails component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.RecruiterDetailsPage';

export default defineMessages({
  updateRecruiterSuccess: {
    id: `${scope}.updateRecruiterSuccess`,
    defaultMessage: 'Recruiter updated successfully',
  },
  deleteRecruiterSuccess: {
    id: `${scope}.deleteRecruiterSuccess`,
    defaultMessage: 'Recruiter deleted successfully',
  },
  deactivateRecruiterSuccess: {
    id: `${scope}.deactivateRecruiterSuccess`,
    defaultMessage: 'Recruiter deactivated successfully',
  },
  emailChangedNotification: {
    id: `${scope}.emailChangedNotification`,
    defaultMessage: 'Your email address has been updated by your company administrator to {newEmail}. Don\'t forget to use this new email address to log into the platform.',
  },
  deleteRecruiterModal: {
    title: {
      id: `${scope}.deleteRecruiterModalTitle`,
      defaultMessage: 'Deleting an account',
    },
    content: {
      id: `${scope}.deleteRecruiterModalContent`,
      defaultMessage: 'Are you sure you want to permanently delete this recruiter and associated reports? This action cannot be undone.',
    },
  },
  deactiveRecruiterModal: {
    title: {
      id: `${scope}.deactiveRecruiterModalTitle`,
      defaultMessage: 'Are you sure?',
    },
    content: {
      id: `${scope}.deactiveRecruiterModalContent`,
      defaultMessage: 'Are you sure you want to permanently deactivate this recruiter? This action cannot be undone. Consider reassigning all open jobs to another recruiter before deactivating.',
    },
  },
});