/*
 * Clientcandidatereport Messages
 *
 * This contains all the text for the Clientcandidatereport container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Clientcandidatereport';

export default defineMessages({
    header: {
        id: `${scope}.header`,
        defaultMessage: 'This is the Clientcandidatereport container!',
    },
    confirmTitle: {
        id: `${scope}.confirmTitle`,
        defaultMessage: 'Notification',
    },
    confirmMessage: {
        id: `${scope}.confirmMessage`,
        defaultMessage: 'This email already has an existing feedback, do you want to update the feedback',
    },
    feedbackSuccessTitle: {
        id: `${scope}.feedbackSuccessTitle`,
        defaultMessage: 'Feedback submitted!',
    },
    feedbackSuccessMessage: {
        id: `${scope}.feedbackSuccessMessage`,
        defaultMessage: 'Your feedback has been sent to the recruiter.',
    },
    buttonDone: {
        id: `${scope}.buttonDone`,
        defaultMessage: 'Done',
    },
    buttonYes: {
        id: `${scope}.buttonYes`,
        defaultMessage: 'Yes',
    },
    buttonNo: {
        id: `${scope}.buttonNo`,
        defaultMessage: 'No',
    },
    interviewTime: {
        id: `${scope}.interviewTime`,
        defaultMessage: 'Interview Time',
    },
    cancel: {
        id: `${scope}.cancel`,
        defaultMessage: 'Cancel',
    },
    add: {
        id: `${scope}.add`,
        defaultMessage: 'Add'
    },
    saveAndSubmit: {
        id: `${scope}.saveAndSubmit`,
        defaultMessage: 'Save & Submit'
    },
});