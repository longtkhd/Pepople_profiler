/*
 * FooterClient Messages
 *
 * This contains all the text for the FooterClient component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.FooterClient';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the FooterClient component!',
  },
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
