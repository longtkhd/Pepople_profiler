/*
 * PaymentSuccessModal Messages
 *
 * This contains all the text for the PaymentSuccessModal components.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.PaymentSuccessModal';

export default defineMessages({
  creditCard: {
    id: `${scope}.creditCard`,
    defaultMessage: 'Credit Card',
  },
  verified: {
    id: `${scope}.verified`,
    defaultMessage: 'Added',
  },
  paymentMethod: {
    id: `${scope}.paymentMethod`,
    defaultMessage: 'Your payment method can be updated anytime via Settings',
  },
});
