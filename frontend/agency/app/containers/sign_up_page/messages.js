/*
 * SignupPage Messages
 *
 * This contains all the text for the SignupPage component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SignupPage';

export default defineMessages({
  tryPeopleProfiler: {
    id: `${scope}.tryPeopleProfiler`,
    defaultMessage: 'Try People Profiler',
  },
  freeFor: {
    id: `${scope}.freeFor`,
    defaultMessage: 'FREE for 14 Days!',
  },
  trialPeopleProfiler: {
    id: `${scope}.trialPeopleProfiler`,
    defaultMessage: 'Trial People Profiler for all users within your recruitment agency.',
  },
  joining: {
    id: `${scope}.joining`,
    defaultMessage: 'Joining is an easy ',
  },
  fourSteps: {
    id: `${scope}.fourSteps`,
    defaultMessage: '4 step process. ',
  },
  letsGo: {
    id: `${scope}.letsGo`,
    defaultMessage: 'Let\'s go!',
  },
  resendIn: {
    id: `${scope}.resendIn`,
    defaultMessage: 'Resend in ',
  },
  resendVerifySuccess: {
    id: `${scope}.resendVerifySuccess`,
    defaultMessage: 'Resend verify email successfully. Please check your email!',
  },
  verificationSent: {
    id: `${scope}.verificationSent`,
    defaultMessage: 'A verification link has been sent to your email account',
  },
  linkClick: {
    id: `${scope}.linkClick`,
    defaultMessage: 'Please click on the link that has just been sent to your email account to verify your email and continue the registration process.',
  },
  checkSpam: {
    id: `${scope}.checkSpam`,
    defaultMessage: 'Please check your spam folder, if you don\'t receive this verification email within 15 mins. Alternatively, you may contact the People Profiler support team.',
  },
  emailExisted: {
    title: {
      id: `${scope}.emailExisted.title`,
      defaultMessage: 'This email already exists in our system!',
    },
    content: {
      id: `${scope}.emailExisted.content`,
      defaultMessage: 'Please login or use another email address.',
    },
  },
});
