/*
 * NotificationListPage Messages
 *
 * This contains all the text for the NotificationListPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NotificationListPage';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Notifications',
  },
  notificationModalTitle: {
    id: `${scope}.notificationModalTitle`,
    defaultMessage: 'Notification content',
  },
  deleteAll: {
    id: `${scope}.deleteAll`,
    defaultMessage: 'Delete All',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  deleteNotification: {
    id: `${scope}.deleteNotification`,
    defaultMessage: 'Are you sure you want to delete this notification?',
  },
  deleteAllNotification: {
    id: `${scope}.deleteAllNotification`,
    defaultMessage: 'Are you sure you want to delete all notification?',
  },
  deleteNotificationSuccess: {
    id: `${scope}.deleteNotificationSuccess`,
    defaultMessage: 'Notification deleted successfully',
  },
  deleteAllNotificationSuccess: {
    id: `${scope}.deleteAllNotificationSuccess`,
    defaultMessage: 'Notifications deleted successfully',
  }
});
