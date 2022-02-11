/*
 * SignupForm Messages
 *
 * This contains all the text for the SignupForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SignupForm';

export default defineMessages({
  firstName: {
    id: `${scope}.firstName`,
    defaultMessage: 'First Name',
  },
  lastName: {
    id: `${scope}.lastName`,
    defaultMessage: 'Last Name',
  },
  jobTitle: {
    id: `${scope}.jobTitle`,
    defaultMessage: 'Job Title',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  phoneNumber: {
    id: `${scope}.phoneNumber`,
    defaultMessage: 'Phone number',
  },
  agencyName: {
    id: `${scope}.agencyName`,
    defaultMessage: 'Agency name',
  },
  country: {
    id: `${scope}.country`,
    defaultMessage: 'Country',
  },
  getStarted: {
    id: `${scope}.getStarted`,
    defaultMessage: 'Get Started',
  },
  firstNameRequired: {
    id: `${scope}.firstName`,
    defaultMessage: 'Please enter first name',
  },
  lastNameRequired: {
    id: `${scope}.lastName`,
    defaultMessage: 'Please enter last name',
  },
  jobTitleRequired: {
    id: `${scope}.firstName`,
    defaultMessage: 'Please enter job title',
  },
  emailRequired: {
    id: `${scope}.emailRequired`,
    defaultMessage: 'Please enter email',
  },
  emailInvalid: {
    id: `${scope}.emailInvalid`,
    defaultMessage: 'Not a valid email',
  },
  phoneNumberRequired: {
    id: `${scope}.phoneNumberRequired`,
    defaultMessage: 'Please enter phone number',
  },
  agencyNameRequired: {
    id: `${scope}.agencyNameRequired`,
    defaultMessage: 'Please enter agency name',
  },
  countryRequired: {
    id: `${scope}.countryRequired`,
    defaultMessage: 'Please choose your country',
  },
});