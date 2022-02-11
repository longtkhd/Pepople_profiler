/*
 * SubscriptionPlanConfrimModal Messages
 *
 * This contains all the text for the SubscriptionPlanConfrimModal component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SubscriptionPlanConfrimModal';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Have you selected the right plan?',
  },
  content: {
    id: `${scope}.content`,
    defaultMessage: `The plan you've selected has fewer users compared to the size of your company. Are you sure you want to proceed with the`,
  },
  ok: {
    id: `${scope}.ok`,
    defaultMessage: 'Ok',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  recommend: {
    id: `${scope}.recommend`,
    defaultMessage: 'The plan you\'ve selected has fewer users compared to the number of recruiters in your company. Please select a higher plan or reduce the number of recruiters.',
  },
});
