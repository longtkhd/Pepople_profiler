/*
 * Status Messages
 *
 * This contains all the text for the Status component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Status';

export default defineMessages({
  progress: {
    id: `${scope}.progress`,
    defaultMessage: 'Profiles in progress',
  },
  submitted: {
    id: `${scope}.submitted`,
    defaultMessage: 'Profiles submitted',
  },
  received: {
    id: `${scope}.received`,
    defaultMessage: 'Client feedback received',
  },
  closed: {
    id: `${scope}.closed`,
    defaultMessage: 'Closed',
  },
  successful: {
    id: `${scope}.successful`,
    defaultMessage: 'Successful',
  },
  missing: {
    id: `${scope}.missing`,
    defaultMessage: 'Missing content',
  },
  notinvitedyet: {
    id: `${scope}.notinvitedyet`,
    defaultMessage: 'Not invited yet',
  },
  completed: {
    id: `${scope}.completed`,
    defaultMessage: 'Completed',
  },
  invited: {
    id: `${scope}.invited`,
    defaultMessage: 'Invited',
  },
  open: {
    id: `${scope}.open`,
    defaultMessage: 'Profiles in progress',
  },


});
