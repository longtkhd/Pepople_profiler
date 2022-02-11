/*
 * ChexBoxGroupCustom Messages
 *
 * This contains all the text for the ChexBoxGroupCustom component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ChexBoxGroupCustom';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ChexBoxGroupCustom component!',
  },

  enableAll: {
    id: `${scope}.enableAll`,
    defaultMessage: 'Enable All',
  },
  disableAll: {
    id: `${scope}.disableAll`,
    defaultMessage: 'Disable All',
  }

});
