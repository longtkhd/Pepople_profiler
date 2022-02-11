/*
 * Menu Messages
 *
 * This contains all the text for the Menu components.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.compoents.Menu';

export default defineMessages({
  employeeList: {
    id: `${scope}.employeeList`,
    defaultMessage: 'Employee List',
  },
  clientList: {
    id: `${scope}.clientList`,
    defaultMessage: 'Client List',
  },
  subscription: {
    id: `${scope}.subscription`,
    defaultMessage: 'Subscription',
  },
  myAccount: {
    id: `${scope}.myAccount`,
    defaultMessage: 'My Account',
  },
  setting: {
    id: `${scope}.setting`,
    defaultMessage: 'Settings',
  },
  signOut: {
    id: `${scope}.signOut`,
    defaultMessage: 'Sign Out',
  },
  myDashboard: {
    id: `${scope}.myDashboard`,
    defaultMessage: 'My Dashboard',
  },
  jobList: {
    id: `${scope}.jobList`,
    defaultMessage: 'Job List',
  },
});
