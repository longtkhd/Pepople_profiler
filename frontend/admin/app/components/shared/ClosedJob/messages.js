/*
 * CloseJob Messages
 *
 * This contains all the text for the CloseJob component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CloseJob';

export default defineMessages({
  statusTag: {
    closed: {
      id: `${scope}.status.closed`,
      defaultMessage: 'Closed',
    }, 
  },
  businessName: {
    id: `${scope}.businessName`,
    defaultMessage: 'Business name',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: 'role',
  },
  shortlisted: {
    id: `${scope}.shortlisted`,
    defaultMessage: 'No. of shortlisted candidates',
  },
  reactive: {
    id: `${scope}.reactive`,
    defaultMessage: 'Re-active',
  },
});