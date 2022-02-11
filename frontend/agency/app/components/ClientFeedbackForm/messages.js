/*
 * ClientFeedbackForm Messages
 *
 * This contains all the text for the ClientFeedbackForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ClientFeedbackForm';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the ClientFeedbackForm component!',
  },
  feedBack: {
    id: `${scope}.feedBack`,
    defaultMessage: 'Initial Client Feedback',
  },
  discuss: {
    id: `${scope}.discuss`,
    defaultMessage: 'Let\'s Discuss',
  },
  interested: {
    id: `${scope}.interested`,
    defaultMessage: 'I\'m interested',
  },
  interview: {
    id: `${scope}.interview`,
    defaultMessage: 'Interview',
  },
  rate: {
    id: `${scope}.rate`,
    defaultMessage: 'Your rating ',
  },
  emailLable: {
    id: `${scope}.emailLable`,
    defaultMessage: 'Email',
  },
  emailMessage: {
    id: `${scope}.emailMessage`,
    defaultMessage: 'The input is not valid E-mail!',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
});
