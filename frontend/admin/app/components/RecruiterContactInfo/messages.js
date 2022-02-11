/*
 * RecruiterContactInfo Messages
 *
 * This contains all the text for RecruiterContactInfo component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.RecruiterContactInfo';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Contact Information',
  },
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
  contactNumber: {
    id: `${scope}.contactNumber`,
    defaultMessage: 'Contact Number',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  firstNameRequired: {
    id: `${scope}.firstNameRequired`,
    defaultMessage: 'Please enter first name',
  },
  lastNameRequired: {
    id: `${scope}.lastNameRequired`,
    defaultMessage: 'Please enter last name',
  },
  jobTitleRequired: {
    id: `${scope}.jobTitleRequired`,
    defaultMessage: 'Please enter job title',
  },
  emailRequired: {
    id: `${scope}.emailRequired`,
    defaultMessage: 'Please enter email',
  },
  contactNumberRequired: {
    id: `${scope}.contactNumberRequired`,
    defaultMessage: 'Please enter contact number',
  },
  emailInvalid: {
    id: `${scope}.emailInvalid`,
    defaultMessage: 'Not a valid email',
  },
});