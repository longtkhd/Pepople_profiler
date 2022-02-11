/*
 * CandidateHeader Messages
 *
 * This contains all the text for the CandidateHeader component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CandidateHeader';

export default defineMessages({
  welcomeText: {
    id: `${scope}.welcomeText`,
    defaultMessage: 'Welcome, ',
  },
  fromText: {
    id: `${scope}.fromText`,
    defaultMessage: 'from',
  },
});
