/*
 * Footer Messages
 *
 * This contains all the text for the Footer components.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.compoents.Footer';

export default defineMessages({
  support: {
    id: `${scope}.support`,
    defaultMessage: 'Support',
  },
  faq: {
    id: `${scope}.faq`,
    defaultMessage: 'FAQ',
  },
  termOfUse: {
    id: `${scope}.termOfUse`,
    defaultMessage: 'Terms of Use',
  },
  privacy: {
    id: `${scope}.privacy`,
    defaultMessage: 'Privacy',
  },
});
