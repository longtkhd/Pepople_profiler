/*
 * RecruiterJobPage Messages
 *
 * This contains all the text for the RecruiterJobPage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.RecruiterJobPage';

export default defineMessages({
  openJob: {
    id: `${scope}.openJob`,
    defaultMessage: 'Open Jobs',
  },
  closedJob: {
    id: `${scope}.closedJob`,
    defaultMessage: 'Closed Jobs',
  },
  changeJobStatusSuccess: {
    id: `${scope}.changeJobStatusSuccess`,
    defaultMessage: 'Job status changed successfully',
  },
});
