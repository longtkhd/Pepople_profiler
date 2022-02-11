/*
 * SubscriptionForm Messages
 *
 * This contains all the text for the SubscriptionForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SubscriptionForm';

export default defineMessages({
  monthly: {
    id: `${scope}.monthly`,
    defaultMessage: 'Monthly',
  },
  yearly: {
    id: `${scope}.yearly`,
    defaultMessage: 'Yearly',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Based on your agency size,',
  },
  recommend: {
    id: `${scope}.recommend`,
    defaultMessage: 'we recommend the {planName} plan',
  },
  notice: {
    id: `${scope}.notice`,
    defaultMessage: 'You will be charged after the 14-day free trial period ends',
  },
  selectBillingType: {
    id: `${scope}.selectBillingType`,
    defaultMessage: 'Please select billing type',
  },
  total: {
    id: `${scope}.total`,
    defaultMessage: 'Total',
  },
  subscribe: {
    id: `${scope}.subscribe`,
    defaultMessage: 'Subscribe'
  }
});