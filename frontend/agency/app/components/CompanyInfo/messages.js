/*
 * CompanyInfo Messages
 *
 * This contains all the text for the CompanyInfo component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CompanyInfo';

export default defineMessages({
  descriptionLine1: {
    id: `${scope}.descriptionLine1`,
    defaultMessage: 'Let\'s create a look and feel that',
  },
  descriptionLine2: {
    id: `${scope}.descriptionLine2`,
    defaultMessage: 'reflects your agency',
  },
  notice: {
    id: `${scope}.notice`,
    defaultMessage: 'We\'ll use this information to make sure all reports sent to your clients have your unique branding. This can be edited at anytime.',
  },
});
