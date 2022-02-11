/*
 * CandidateMainReport Messages
 *
 * This contains all the text for the CandidateMainReport component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CandidateMainReport';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Recruiter List',
  },
  inviteColleague: {
    id: `${scope}.inviteColleague`,
    defaultMessage: 'Invite a Colleague',
  },
  exportPDF: {
    id: `${scope}.exportPDF `,
    defaultMessage: 'Export to PDF',
  },
  interested: {
    id: `${scope}.interested `,
    defaultMessage: `I'm interested`,
  },
  disccuss: {
    id: `${scope}.disccuss `,
    defaultMessage: `Let's Discuss`,
  },
  backgroundCheckLable: {
    id: `${scope}.backgroundCheckLable `,
    defaultMessage: `Internet & Social Media Background Check Completed`,
  },
  rightToWork: {
    id: `${scope}.rightToWork `,
    defaultMessage: `Right to work`,
  },
  linkedRecommendation: {
    id: `${scope}.linkedRecommendation `,
    defaultMessage: `LinkedIn Recommendations`,
  },
  remuse: {
    id: `${scope}.remuse `,
    defaultMessage: `Resume`,
  },
});
