/*
 * CreateAssessmentType Messages
 *
 * This contains all the text for the CreateAssessmentType container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CreateAssessmentType';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the CreateAssessmentType container!',
  },
  addAssessment: {
    id: `${scope}.addAssessment`,
    defaultMessage: 'Add Assessment Type',
  },
  addNew: {
    id: `${scope}.addNew`,
    defaultMessage: 'Add new',
  }
});
