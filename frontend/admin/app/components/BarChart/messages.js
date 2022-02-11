/*
 * BarChart Messages
 *
 * This contains all the text for the BarChart component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.BarChart';

export default defineMessages({
  top10: {
    id: `${scope}.top10`,
    defaultMessage: 'Top 10 agencies used CV parsing tool!',
  },
  total: {
    id: `${scope}.total`,
    defaultMessage: 'Top CV Parsing API Call'
  },
});
