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
  invitedYet: {
    id: `${scope}.invitedYet`,
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
    defaultMessage: 'Open',
  },
  registering: {
    id: `${scope}.registering`,
    defaultMessage: 'Registering',
  },
  active: {
    id: `${scope}.active`,
    defaultMessage: 'Active',
  },
  deactive: {
    id: `${scope}.deactive`,
    defaultMessage: 'Deactivated',
  },



});
