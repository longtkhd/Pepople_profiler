/*
 * PaymentHistoryInfo Messages
 *
 * This contains all the text for the PaymentHistoryInfo container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.PaymentHistoryInfo';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the PaymentHistoryInfo container!',
  },
  subscriptionTitle: {
    id: `${scope}.subscriptionTitle`,
    defaultMessage: 'Subscription Summary',
  },
  paymentHistoryTitle: {
    id: `${scope}.paymentHistoryTitle`,
    defaultMessage: 'Payment History',
  },


});
