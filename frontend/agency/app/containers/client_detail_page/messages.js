/*
 * ClientDetailPage Messages
 *
 * This contains all the text for the ClientDetailPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ClientDetailPage';

export default defineMessages({
  clientInfo: {
    id: `${scope}.clientInfo`,
    defaultMessage: 'Client Information',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  contact: {
    id: `${scope}.contact`,
    defaultMessage: 'Contacts',
  },
  openJob: {
    id: `${scope}.openJob`,
    defaultMessage: 'Open Jobs',
  },
  closedJob: {
    id: `${scope}.closedJob`,
    defaultMessage: 'Closed jobs',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  changeJobStatusSuccess: {
    id: `${scope}.changeJobStatusSuccess`,
    defaultMessage: 'Job Status Changed Successfully',
  },
});
