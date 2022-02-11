/*
 * Downgradenotification Messages
 *
 * This contains all the text for the Downgradenotification component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.DowngradeNotificationModel';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: "Oops, that won't work. ",
  },
  error: {
    id: `${scope}.error`,
    defaultMessage:
      'The current number of users on your account exceeds the number of recruiters in your agency.',
  },
  suggestions: {
    id: `${scope}.suggestions`,
    defaultMessage:
      'Please edit number of recruiters in your agency or remove some existing users on your current plan.',
  }
});
