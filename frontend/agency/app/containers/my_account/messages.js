/*
 * MyAccount Messages
 *
 * This contains all the text for the MyAccount container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.MyAccount';

export default defineMessages({
  update: {
    id: `${scope}.update`,
    defaultMessage: 'Update',
  },
  updatePersonal: {
    id: `${scope}.updatePersonal`,
    defaultMessage: 'Update your personal details',
  },
  resetPasssword: {
    id: `${scope}.resetPasssword`,
    defaultMessage: 'Reset Password',
  },
  deActiveAccount: {
    id: `${scope}.deActiveAccount`,
    defaultMessage: 'Deactivate The Business Account',
  },
  requestChange: {
    id: `${scope}.requestChange`,
    defaultMessage: 'Request to change',
  },
  requestChangeEmailTitle: {
    id: `${scope}.requestChangeEmailTitle`,
    defaultMessage: 'Request to change email',
  },
  requestChangeEmailContent: {
    id: `${scope}.requestChangeEmailContent`,
    defaultMessage:
      'Submit your email change request to your company admin user',
  },
  someThingsWrong: {
    id: `${scope}.someThingsWrong`,
    defaultMessage: 'Oops, somethings wrong!',
  },
  requestChangeMailSuccess: {
    id: `${scope}.requestChangeMailSuccess`,
    defaultMessage:
      'An email has been sent to your agency to notify about your change email request. Please waiting for the response',
  },
  emailAlreadyExist: {
    id: `${scope}.emailAlreadyExist`,
    defaultMessage: 'Email already exist',
  },
  resetPasswordSuccess: {
    id: `${scope}.resetPasswordSuccess`,
    defaultMessage: 'Password reset successfully',
  },
  resetPasswordFailed: {
    id: `${scope}.resetPasswordSuccess`,
    defaultMessage: 'Reset password failed',
  },
  updatePersonalDetailsSuccess: {
    id: `${scope}.updatePersonalDetailsSuccess`,
    defaultMessage: 'Personal details successfully updated',
  },
  updatePersonalDetailsFailed: {
    id: `${scope}.updatePersonalDetailsFailed`,
    defaultMessage: 'Personal details updated failed',
  },
  requestSuccess: {
    id: `${scope}.requestSuccess`,
    defaultMessage: 'Request Email',
  },
  requestContent: {
    id: `${scope}.requestContent`,
    defaultMessage:
      'Your request to change your email address has been sent to your agency administrator.',
  },
  done: {
    id: `${scope}.done`,
    defaultMessage: 'Done',
  },
  failed: {
    id: `${scope}.failed`,
    defaultMessage: 'Oops, Something went wrong',
  },
});
