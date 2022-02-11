/*
 * PreviewModalEmail Messages
 *
 * This contains all the text for the PreviewModalEmail component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.PreviewModalEmail';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the PreviewModalEmail component!',
  },
   preview: {
    id: `${scope}.preview`,
    defaultMessage: 'Preview [Email Template Name] Template',
  },
  previewButton: {
    id: `${scope}.previewButton`,
    defaultMessage: 'Use now',
  },
  previewButtonIcon: {
    id: `${scope}.previewButtonIcon`,
    defaultMessage: 'Preview',
  },
});
