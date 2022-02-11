/*
 * Header Messages
 *
 * This contains all the text for the Header component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Header';

export default defineMessages({
  welcomeText: {
    id: `${scope}.welcomeText`,
    defaultMessage: 'Welcome, People Profiler Admin',
  },
  fromText: {
    id: `${scope}.fromText`,
    defaultMessage: 'from',
  },
});
