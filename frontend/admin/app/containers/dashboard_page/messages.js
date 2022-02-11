/*
 * DashboardPage Messages
 *
 * This contains all the text for the DashboardPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DashboardPage';

export default defineMessages({
  agencies: {
    id: `${scope}.agencies`,
    defaultMessage: 'Total Agencies:',
  },
  users: {
    id: `${scope}.users`,
    defaultMessage: 'Total Users:',
  },
  viewAgen: {
    id: `${scope}.viewAgen`,
    defaultMessage: 'View Agencies',
  },
  top10Cv: {
    id: `${scope}.top10Cv`,
    defaultMessage: 'Top 10 agencies used CV parsing tool',
  },
  totalCv: {
    id: `${scope}.totalCv`,
    defaultMessage: 'Top CV Parsing API Call:'
  },
  top10Assessment: {
    id: `${scope}.top10Assessment`,
    defaultMessage: 'Top 10 agencies used talent assessment',
  },
  totalAssessment: {
    id: `${scope}.totalAssessment`,
    defaultMessage: 'Total Talent Assessment Usage:'
  },

});
