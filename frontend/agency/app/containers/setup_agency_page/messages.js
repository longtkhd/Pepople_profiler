/*
 * SetupAgencyPage Messages
 *
 * This contains all the text for the SetupAgencyPage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SetupAgencyPage';

export default defineMessages({
  emailVerified: {
    id: `${scope}.emailVerified`,
    defaultMessage: 'Your email address has been verified.',
  },
  pleaseCreatePassword: {
    id: `${scope}.pleaseCreatePassword`,
    defaultMessage: 'Please create your password',
  },
  createPasswordStepTitle: {
    id: `${scope}.createPasswordStepTitle`,
    defaultMessage: '1. Create Password',
  },
  companyInfoStepTitle: {
    id: `${scope}.companyInfoStepTitle`,
    defaultMessage: '2. Company Info',
  },
  subscriptionInfoStepTitle: {
    id: `${scope}.subscriptionInfoStepTitle`,
    defaultMessage: '3. Subscription Info',
  },
  paymentInfoStepTitle: {
    id: `${scope}.paymentInfoStepTitle`,
    defaultMessage: '4. Payment Info',
  },
  resendVerifySuccess: {
    id: `${scope}.resendVerifySuccess`,
    defaultMessage: 'Resend verify email successfully. Please check your email!',
  },
  createPasswordSuccess: {
    id: `${scope}.createPasswordSuccess`,
    defaultMessage: 'Password created successfully',
  },
  updateAgencySuccess: {
    id: `${scope}.updateAgencySuccess`,
    defaultMessage: 'Agency report branding successfully uploaded',
  },
  updateSubscriptionSuccess: {
    id: `${scope}.updateSubscriptionSuccess`,
    defaultMessage: 'Subscription updated successfully',
  },
  tokenInvalid: {
    id: `${scope}.tokenInvalid`,
    defaultMessage: 'Your token is not valid or has been expired.',
  },
});
