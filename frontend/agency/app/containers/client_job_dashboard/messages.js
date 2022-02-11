/*
 * ClientJobDashboard Messages
 *
 * This contains all the text for the ClientJobDashboard container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ClientJobDashboard';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ClientJobDashboard container!',
  },
  download_activity_report: {
    id: `${scope}.download_activity_report`,
    defaultMessage: 'Download the recruitment activity report',
  },
});