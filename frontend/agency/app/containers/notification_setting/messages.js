/*
 * NotificationSetting Messages
 *
 * This contains all the text for the NotificationSetting container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NotificationSetting';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Manage Notifications',
  },
  headerRecruiter: {
    id: `${scope}.header`,
    defaultMessage: 'Manage Notification Settings',
  },
  enableAll: {
    id: `${scope}.enableAll`,
    defaultMessage: 'Enable All',
  },
  disableAll: {
    id: `${scope}.disableAll`,
    defaultMessage: 'Disable All',
  },
  disableAllModalContent: {
    id: `${scope}.disableAllModalContent`,
    defaultMessage: 'Are you sure you want to disable all notifications?',
  },
  updateNotiSuccess: {
    id: `${scope}.updateNotiSuccess`,
    defaultMessage: 'Notification settings updated successfully',
  },
});
