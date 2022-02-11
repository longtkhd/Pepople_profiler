/*
 * EditEmailTemplate Messages
 *
 * This contains all the text for the EditEmailTemplate container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.EditEmailTemplate';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the EditEmailTemplate container!',
  },
  update: {
    id: `${scope}.update`,
    defaultMessage: 'Update',
  },
});
