/*
 * ProgressBarCheck Messages
 *
 * This contains all the text for the ProgressBarCheck component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ProgressBarCheck';

export default defineMessages({
  weak: {
    id: `${scope}.weak`,
    defaultMessage: 'Too weak',
  },
  medium: {
    id: `${scope}.medium`,
    defaultMessage: 'Medium',
  },
  veryStrong: {
    id: `${scope}.veryStrong`,
    defaultMessage: 'Verry strong',
  },
});
