/*
 * InviteAssessmentEmail Messages
 *
 * This contains all the text for the InviteAssessmentEmail container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.InviteAssessmentEmail';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the InviteClientEmail container!',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Cam, prepare your email to Roger from Orange Inc.',
  },
  preview: {
    id: `${scope}.preview`,
    defaultMessage: 'Preview',
  },
  useNow: {
    id: `${scope}.useNow`,
    defaultMessage: 'Use now',
  },
  clear: {
    id: `${scope}.clear`,
    defaultMessage: 'Clear',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save Template',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  send: {
    id: `${scope}.send`,
    defaultMessage: 'Send',
  },
  saveTitle: {
    id: `${scope}.saveTitle`,
    defaultMessage: 'Save',
  },

  preview: {
    id: `${scope}.preview`,
    defaultMessage: 'Preview [Email Template Name] Template',
  },
  previewButton: {
    id: `${scope}.previewButton`,
    defaultMessage: 'Send Now',
  },
  previewButtonIcon: {
    id: `${scope}.previewButtonIcon`,
    defaultMessage: 'Preview',
  },
  inviteSuccessTitle: {
    id: `${scope}.inviteSuccessTitle`,
    defaultMessage: 'Invite sent!',
  },
  inviteSuccessMessage: {
    id: `${scope}.inviteSuccessMessage`,
    defaultMessage: 'Your invite has been sent to the candidate.',
  },
  inviteDone: {
    id: `${scope}.inviteDone`,
    defaultMessage: 'Done',
  },
  saved: {
    id: `${scope}.saved`,
    defaultMessage: 'Saved',
  },
  EmailSaved: {
    id: `${scope}.EmailSaved`,
    defaultMessage: 'The email template has been saved.',
  },
});
