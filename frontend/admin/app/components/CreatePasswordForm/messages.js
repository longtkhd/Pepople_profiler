/*
 * CreatePasswordForm Messages
 *
 * This contains all the text for the CreatePasswordForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreatePasswordForm';

export default defineMessages({
  password: {
    id: `${scope}.password`,
    defaultMessage: 'New password',
  },
  confirmPassword: {
    id: `${scope}.confirmPassword`,
    defaultMessage: 'Confirm new password',
  },
  passwordRequirement: {
    id: `${scope}.passwordRequirement`,
    defaultMessage: 'Password Requirements:',
  },
  passwordRequirement1: {
    id: `${scope}.passwordRequirement`,
    defaultMessage: '- Must contain at least 8 characters',
  },
  passwordRequirement2: {
    id: `${scope}.passwordRequirement2`,
    defaultMessage: '- Must contain at least one uppercase letter',
  },
  passwordRequirement3: {
    id: `${scope}.passwordRequirement2`,
    defaultMessage: '- Must contain at least one lowercase letter',
  },
  passwordRequirement4: {
    id: `${scope}.passwordRequirement4`,
    defaultMessage: '- Must contain one number',
  },
  passwordRequired: {
    id: `${scope}.passwordRequired`,
    defaultMessage: 'Please enter password',
  },
  confirmPasswordRequired: {
    id: `${scope}.confirmPasswordRequired`,
    defaultMessage: 'Please confirm your password',
  },
  passwordsNotMatch: {
    id: `${scope}.passwordsNotMatch`,
    defaultMessage: 'Passwords don\'t match. \n Please double check your passwords and try again',
  },
  passwordInvalid: {
    id: `${scope}.passwordInvalid`,
    defaultMessage: 'Not a valid password',
  },
  resetPassword:{
    id: `${scope}.resetPassword`,
    defaultMessage: 'Reset password',
  },
});
