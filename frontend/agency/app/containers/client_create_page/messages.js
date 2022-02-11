/*
 * ClientCreatePage Messages
 *
 * This contains all the text for the ClientCreatePage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ClientCreatePage';

export default defineMessages({
  clientInfo: {
    id: `${scope}.clientInfo`,
    defaultMessage: 'Client Information',
  },
  contacts: {
    id: `${scope}.contacts`,
    defaultMessage: 'Contacts',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create',
  },
  contactName: {
    id: `${scope}.contactName`,
    defaultMessage: 'Contact Name',
  },
  contactNumber: {
    id: `${scope}.contactNumber`,
    defaultMessage: 'Contact Number',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  emailRequired: {
    id: `${scope}.emailRequired`,
    defaultMessage: 'Please enter email',
  },
  emailInvalid: {
    id: `${scope}.emailInvalid`,
    defaultMessage: 'Not a valid email',
  },
  contactNumberInvalid: {
    id: `${scope}.contactNumberInvalid`,
    defaultMessage: 'Not a valid contact number',
  },
  action: {
    id: `${scope}.actions`,
    defaultMessage: 'Action',
  },
  username: {
    id: `${scope}.username`,
    defaultMessage: 'Business Name',
  },
  industry: {
    id: `${scope}.industry`,
    defaultMessage: 'Industry',
  },
  createClientSuccess: {
    id: `${scope}.createClientSuccess`,
    defaultMessage: 'Client created successfully',
  },
});
