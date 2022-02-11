/*
 * AdminUserDetails Messages
 *
 * This contains all the text for the AdminUserDetails container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AdminUserDetails';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AdminUserDetails container!',
  },
  contactInfo: {
    id: `${scope}.  contactInfo`,
    defaultMessage: 'Contact Infomation',
  },
  jobDetails: {
    id: `${scope}.  jobDetails`,
    defaultMessage: 'Job Details',

  }

});
