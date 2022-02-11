/*
 * ModalCustom Messages
 *
 * This contains all the text for the ModalCustom component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ModalCustom';

export default defineMessages({
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add',
  },
});
