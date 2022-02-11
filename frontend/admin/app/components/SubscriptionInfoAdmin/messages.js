/*
 * SubscriptionInfoAdmin Messages
 *
 * This contains all the text for the SubscriptionInfoAdmin component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SubscriptionInfoAdmin';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the SubscriptionInfoAdmin component!',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Subscription Info',
  },
  planLevel: {
    id: `${scope}.planLevel`,
    defaultMessage: 'Plan Level',
  },
  billingPeriod: {
    id: `${scope}.billingPeriod:`,
    defaultMessage: 'Billing Period',
  },
  cvParsing: {
    id: `${scope}.cvParsing`,
    defaultMessage: 'CV Parsing API Calls',
  },
  talentAssessment: {
    id: `${scope}.talentAssessment`,
    defaultMessage: 'Talent Assessment Usage',
  }
});
