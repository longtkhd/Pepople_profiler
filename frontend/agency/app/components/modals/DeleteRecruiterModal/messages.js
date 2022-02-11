/*
 * DeleteRecruiterModal Messages
 *
 * This contains all the text for the DeleteRecruiterModal component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.DeleteRecruiterModal';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Deleting an account xx',
  },
  content: {
    id: `${scope}.content`,
    defaultMessage: 'Are you sure you want to permanently delete this recruiter and associated reports? This action cannot be undone.',
  },
});
