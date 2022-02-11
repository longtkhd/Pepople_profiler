/*
 * NotificationSettingItem Messages
 *
 * This contains all the text for the NotificationSettingItem component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.NotificationSettingItem';

export default defineMessages({
  websiteNotification: {
    id: `${scope}.websiteNotification`,
    defaultMessage: 'Website Notification',
  },
  emailNotification: {
    id: `${scope}.emailNotification`,
    defaultMessage: 'Email Notification',
  },
});
