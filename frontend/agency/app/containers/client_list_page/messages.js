/*
 * ClientListPage Messages
 *
 * This contains all the text for the ClientListPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ClientListPage';

export default defineMessages({
  clientList: {
    id: `${scope}.clientList`,
    defaultMessage: 'Client list',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create',
  },
  deleteClientSuccess: {
    id: `${scope}.deleteClientSuccess`,
    defaultMessage: 'Client deleted successfully',
  },
});
