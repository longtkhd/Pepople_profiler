/*
 * AgencySetupDone Messages
 *
 * This contains all the text for the AgencySetupDone component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AgencySetupDone';

export default defineMessages({
  congratulation: {
    id: `${scope}.congratulation`,
    defaultMessage: 'Congratulations,',
  },
  allDone: {
    id: `${scope}.allDone`,
    defaultMessage: 'all done!',
  },
  enjoy: {
    id: `${scope}.enjoy`,
    defaultMessage: 'Enjoy your',
  },
  freeTrial: {
    id: `${scope}.freeTrial`,
    defaultMessage: '14-day free trial',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Once you\'ve logged in, you will need to invite your agency recruiters to the platform. Don\'t worry - it\'s super easy!',
  },
  thankYou: {
    id: `${scope}.enjoyFreeTrial`,
    defaultMessage: 'Thank you for your business. We\'re proud to be supporting the recruitment industry.',
  },
});
