/*
 * SettingPage Messages
 *
 * This contains all the text for the SettingPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.SettingPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Settings',
  },
  agencySetting: {
    id: `${scope}.agencySetting`,
    defaultMessage: 'Agency settings',
  },
  paymentMedthodSetting: {
    id: `${scope}.paymentMedthodSetting`,
    defaultMessage: 'Payment method settings',
  },
  notificationSetting: {
    id: `${scope}.notificationSetting`,
    defaultMessage: 'Notification settings',
  },
  emailTemplateSetting: {
    id: `${scope}.emailTemplateSetting`,
    defaultMessage: 'Email template settings',
  },
  manage: {
    id: `${scope}.manage`,
    defaultMessage: 'Manage',
  },

});
