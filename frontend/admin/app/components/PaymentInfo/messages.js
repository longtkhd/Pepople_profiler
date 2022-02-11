/*
 * PaymentInfo Messages
 *
 * This contains all the text for PaymentInfo component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.PaymentInfo';

export default defineMessages({
  title1: {
    id: `${scope}.title1`,
    defaultMessage: 'Almost there! 2 more steps to go',
  },
  title2: {
    id: `${scope}.title2`,
    defaultMessage: 'to make a positive difference for your team.',
  },
  helper: {
    id: `${scope}.helper`,
    defaultMessage: 'Your credit card will not be charged until your free trial expires on',
  },
  description1: {
    id: `${scope}.description1`,
    defaultMessage: 'Cancel Anytime',
  },
  description2: {
    id: `${scope}.description2`,
    defaultMessage: 'No lock-in contract',
  },
  description3: {
    id: `${scope}.description3`,
    defaultMessage: 'Upgrade and downgrade at no extra cost',
  },
  description4: {
    id: `${scope}.description4`,
    defaultMessage: '14-day free trial',
  },
});