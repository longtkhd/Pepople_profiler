/*
 * NotFoundPage Messages
 *
 * This contains all the text for the NotFoundPage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NotFoundPage';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: '404',
  },
  content: {
    id: `${scope}.content`,
    defaultMessage: 'Sorry, the page you visited does not exist.',
  },
  invitedContent: {
    id: `${scope}.invitedContent`,
    defaultMessage: 'Sorry, the page you visited does not exist or the invitation to this page has been revoked.',
  },
});
