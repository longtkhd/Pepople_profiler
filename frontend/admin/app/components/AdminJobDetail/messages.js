/*
 * AdminJobDetail Messages
 *
 * This contains all the text for the AdminJobDetail component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AdminJobDetail';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AdminJobDetail component!',
  },
  closeJob: {
    id: `${scope}.closeJob`,
    defaultMessage: 'Closed Jobs'
  },
  openJob: {
    id: `${scope}.openJob`,
    defaultMessage: 'Open Jobs',
  },
  CvParsing: {
    id: `${scope}.CvParsing`,
    defaultMessage: 'CV Parsing Used',
  },
  totalReport: {
    id: `${scope}.totalReport`,
    defaultMessage: 'Total Candidate Reports Generated',
  },
  totalAssess: {
    id: `${scope}.totalAssess`,
    defaultMessage: 'Total Assessment Usage',
  },
});
