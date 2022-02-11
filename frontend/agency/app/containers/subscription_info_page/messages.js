/*
 * SubscriptionInfoPage Messages
 *
 * This contains all the text for the SubscriptionInfoPage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SubscriptionInfo';

export default defineMessages({
  subscriptionTitle: {
    id: `${scope}.subscriptionTitle`,
    defaultMessage: 'Subscription Summary',
  },
  paymentMethodTitle: {
    id: `${scope}.paymentMethodTitle`,
    defaultMessage: 'Payment Method',
  },
  paymentHistoryTitle: {
    id: `${scope}.paymentHistoryTitle`,
    defaultMessage: 'Payment History',
  },
  manageButton: {
    id: `${scope}.manageButton`,
    defaultMessage: 'Manage',
  },
  linkAnother: {
    id: `${scope}.linkAnother`,
    defaultMessage: 'Subscribe to Another Plan',
  },
  linkCancel: {
    id: `${scope}.linkCancel`,
    defaultMessage: 'Cancel the Current Plan',
  },
  editButton: {
    id: `${scope}.editButton`,
    defaultMessage: 'Edit',
  },
  modalCancelTitle: {
    id: `${scope}.modalCancelTitle`,
    defaultMessage: 'Are you sure',
  },
  modalCancelMessage: {
    id: `${scope}.modalCancelMessage`,
    defaultMessage: 'Are you sure you want to cancel your subscription? \
      All recruiter accounts will be deactivated and this permanent action cannot be undone.',
  },
  modalButtonYes: {
    id: `${scope}.modalButtonYes`,
    defaultMessage: 'Yes',
  },
  modalButtonNo: {
    id: `${scope}.modalButtonNo`,
    defaultMessage: 'No',
  },
});
