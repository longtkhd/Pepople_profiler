/*
 * NotificationList Messages
 *
 * This contains all the text for the NotificationList component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.NotificationList';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Notification',
  },
  notificationModalTitle: {
    id: `${scope}.notificationModalTitle`,
    defaultMessage: 'Notification Content',
  },
  viewAll: {
    id: `${scope}.viewAll`,
    defaultMessage: 'View All',
  },
});
