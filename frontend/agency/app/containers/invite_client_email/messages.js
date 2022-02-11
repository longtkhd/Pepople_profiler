/*
 * InviteClientEmail Messages
 *
 * This contains all the text for the InviteClientEmail container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.InviteClientEmail';

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
  saved: {
    id: `${scope}.saved`,
    defaultMessage: 'Saved',
  },
  EmailSaved: {
    id: `${scope}.EmailSaved`,
    defaultMessage: 'The email template has been saved.',
  },
  done: {
    id: `${scope}.done`,
    defaultMessage: 'Done',
  },
  alright: {
    id: `${scope}.alright`,
    defaultMessage: 'Alright! Email sent',
  },
  sendSuccess: {
    id: `${scope}.sendSuccess`,
    defaultMessage: 'Your invite has been sent to the client.',
  },
});
