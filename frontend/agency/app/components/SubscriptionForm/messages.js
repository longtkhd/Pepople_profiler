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
    defaultMessage: 'Number of recruiters in your agency?',
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
  },
  errorRecruiter: {
    id: `${scope}.errorRecruiter`,
    defaultMessage: 'You entered the number of recruiters in your agency which is less than the number of current users. Please re-enter'
  },
  errorTitle: {
    id: `${scope}.errorTitle`,
    defaultMessage: 'Error'
  },
  paymentModalTitle: {
    id: `${scope}.paymentModalTitle`,
    defaultMessage: '{status} Plan'
  },
  paymentUpgradeContent: {
    id: `${scope}.paymentUpgradeContent`,
    defaultMessage: `You upgraded the {currentPackageName} package to the {newPackageName} one,
      we will give you a discount of $AU{discount},
      The amount you must pay for the upgrade is $AU{amount_before_tax} + GST`
  },
  paymentUpdateContent: {
    id: `${scope}.paymentUpdateContent`,
    defaultMessage: `You just changed the package {currentPackageName} to the package {newPackageName},
      The amount you must pay for the change is $AU{amount_before_tax} + GST`
  },
});
