/*
 * HeaderClient Messages
 *
 * This contains all the text for the HeaderClient component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.HeaderClient';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the HeaderClient component!',
  },
  welcomeText: {
    id: `${scope}.welcomeText`,
    defaultMessage: 'welcomeText',

  }
});
