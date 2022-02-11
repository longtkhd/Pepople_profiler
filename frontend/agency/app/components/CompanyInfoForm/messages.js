/*
 * CompanyInfoForm Messages
 *
 * This contains all the text for the CompanyInfoForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CompanyInfoForm';

export default defineMessages({
  companyLogo: {
    id: `${scope}.companyLogo`,
    defaultMessage: 'Company Logo',
  },
  industry: {
    id: `${scope}.industry`,
    defaultMessage: 'Industry',
  },
  agencySize: {
    id: `${scope}.agencySize`,
    defaultMessage: 'Number of recruiters in your agency?',
  },
  backgroundImage: {
    id: `${scope}.backgroundImage`,
    defaultMessage: 'Background image',
  },
  selectColor: {
    id: `${scope}.selectColor`,
    defaultMessage: 'Select header & footer colour',
  },
  font: {
    id: `${scope}.font`,
    defaultMessage: 'Colour',
  },
  links: {
    id: `${scope}.links`,
    defaultMessage: 'Links',
  },
  buttons: {
    id: `${scope}.buttons`,
    defaultMessage: 'Buttons',
  },
  replace: {
    id: `${scope}.buttons`,
    defaultMessage: 'Replace',
  },
  curiousToKnow: {
    id: `${scope}.curiousToKnow`,
    defaultMessage: 'Curious to know what an agency branded report looks like?',
  },
  checkout: {
    id: `${scope}.checkout`,
    defaultMessage: 'Check out this example',
  },
  selectTier: {
    id: `${scope}.selectTier`,
    defaultMessage: 'Select Tier',
  },
  agencyCountry: {
    id: `${scope}.agencyCountry`,
    defaultMessage: 'Country',
  },
  agencyName: {
    id: `${scope}.agencyName`,
    defaultMessage: 'Agency name',
  },
  logoRequired: {
    id: `${scope}.logoRequired`,
    defaultMessage: 'Don\'t forget your logo',
  },
  industryRequired: {
    id: `${scope}.industryRequired`,
    defaultMessage: 'Please enter industry',
  },
  agencySizeRequired: {
    id: `${scope}.agencySizeRequired`,
    defaultMessage: 'Please enter agency size',
  },
  agencyCountryRequired: {
    id: `${scope}.agencyCountryRequired`,
    defaultMessage: 'Please enter country',
  },
  agencyNameRequired: {
    id: `${scope}.agencyNameRequired`,
    defaultMessage: 'Please enter agency name',
  },
  logoDescription: {
    id: `${scope}.logoDescription`,
    defaultMessage: 'Upload a png file with a transparent background. \n Minimum dimensions are 300 x 300 pixels',
  },
  backgroundDescription: {
    id: `${scope}.backgroundDescription`,
    defaultMessage: 'Upload png, jpg, jpeg format image\n Minimum dimensions: 1440 x 250 pixels',
  },
});
