/*
 * TableCustom Messages
 *
 * This contains all the text for the TableCustom component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.TableCustom';

export default defineMessages({
  business: {
    id: `${scope}.business`,
    defaultMessage: 'Business Name',
  },
  contact: {
    id: `${scope}.contact`,
    defaultMessage: 'Contact Name',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  role: {
    id: `${scope}.role`,
    defaultMessage: 'Role',
  },
  workType: {
    id: `${scope}.workType`,
    defaultMessage: 'Work Type',
  },
  shortlisted: {
    id: `${scope}.shortlisted`,
    defaultMessage: 'Shortlisted',
  },
  actions: {
    id: `${scope}.actions`,
    defaultMessage: 'Actions',
  },
});
