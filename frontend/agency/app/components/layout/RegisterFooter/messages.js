/*
 * RegisterFooter Messages
 *
 * This contains all the text for the RegisterFooter components.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.compoents.RegisterFooter';

export default defineMessages({
  existingUser: {
    id: `${scope}.existingUser`,
    defaultMessage: 'Existing user?',
  },
  loginHere: {
    id: `${scope}.loginHere`,
    defaultMessage: 'Login here',
  },
  termOfUse: {
    id: `${scope}.termOfUse`,
    defaultMessage: 'Terms of Use',
  },
  privacy: {
    id: `${scope}.privacy`,
    defaultMessage: 'Privacy',
  },
});
