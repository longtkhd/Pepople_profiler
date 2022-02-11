/*
 * RecruiterJobDetails Messages
 *
 * This contains all the text for the RecruiterJobDetails component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.RecruiterJobDetails';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Job Details',
  },
  closedJobs: {
    id: `${scope}.closedJobs`,
    defaultMessage: 'Closed Jobs',
  },
  openJobs: {
    id: `${scope}.openJobs`,
    defaultMessage: 'Open Jobs',
  },
  cvParsingUsed: {
    id: `${scope}.cvParsingUsed`,
    defaultMessage: 'CV Parsing Used',
  },
  candidateReports: {
    id: `${scope}.candidateReports`,
    defaultMessage: ' ',
  },
  assesmentUsage: {
    id: `${scope}.assesmentUsage`,
    defaultMessage: 'Total Assessment Usage',
  },
});