/*
 * Congratulation Messages
 *
 * This contains all the text for the Congratulation component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Congratulation';

export default defineMessages({
  done: {
    id: `${scope}.done`,
    defaultMessage: 'all done!',
  },
  congratulations: {
    id: `${scope}.congratulations`,
    defaultMessage: 'Congratulations, ',
  },
  content1: {
    id: `${scope}.content1`,
    defaultMessage: "You're now ready to login using your nominated email address and password.",
  },
  content2: {
    id: `${scope}.content2`,
    defaultMessage: "We're glad you're here and proud to be supporting the recuitment industry.",
  },
  login: {
    id: `${scope}.login`,
    defaultMessage: "Login",
  },
});
