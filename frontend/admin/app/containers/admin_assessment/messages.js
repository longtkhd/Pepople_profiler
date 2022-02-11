/*
 * AdminAssessment Messages
 *
 * This contains all the text for the AdminAssessment container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.AdminAssessment';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AdminAssessment container!',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Assessment Industry',
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add new',
  },
});
