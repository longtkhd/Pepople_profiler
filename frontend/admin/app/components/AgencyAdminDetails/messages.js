/*
 * AgencyAdminDetails Messages
 *
 * This contains all the text for the AgencyAdminDetails component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AgencyAdminDetails';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AgencyAdminDetails component!',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'ABC Agency Pty Ltd',
  },
  delete: {
    id: `${scope}.title`,
    defaultMessage: 'Delete',
  },
  Deactivate: {
    id: `${scope}.title`,
    defaultMessage: 'Deactivate',
  },
  View: {
    id: `${scope}.View`,
    defaultMessage: 'View Recruiter List',
  },
  deleteSuccess: {
    id: `${scope}.deleteSuccess`,
    defaultMessage: 'Delete Agency Success',
  },
  Error: {
    id: `${scope}.Error`,
    defaultMessage: 'Oops, Something went wrong',
  },
  deleteErrorContent: {
    id: `${scope}.deleteErrorContent`,
    defaultMessage: `This Agency can't be deleted`,
  },
  deactiveSuccess: {
    id: `${scope}.deactiveSuccess`,
    defaultMessage: `Deactive Agency Success`,
  },
});
