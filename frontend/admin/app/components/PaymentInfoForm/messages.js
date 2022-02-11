/*
 * PaymentInfoForm Messages
 *
 * This contains all the text for PaymentInfoForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.PaymentInfoForm';

export default defineMessages({
  creditCard: {
    id: `${scope}.creditCard`,
    defaultMessage: 'Credit Card Number',
  },
  cardName: {
    id: `${scope}.cardName`,
    defaultMessage: 'Name on Card',
  },
  expiryDate: {
    id: `${scope}.expiryDate`,
    defaultMessage: 'Expiry Date',
  },
  cvc: {
    id: `${scope}.cvc`,
    defaultMessage: 'cvc',
  },
  MM: {
    id: `${scope}.MM`,
    defaultMessage: 'MM',
  },
  YY: {
    id: `${scope}.YY`,
    defaultMessage: 'YY',
  },
  addressLine: {
    id: `${scope}.addressLine`,
    defaultMessage: 'Address'
  },
  addressCity: {
    id: `${scope}.addressCity`,
    defaultMessage: 'City'
  },
  addressCountry: {
    id: `${scope}.addressCountry`,
    defaultMessage: 'Country'
  },
  clickingContinue: {
    id: `${scope}.clickingContinue`,
    defaultMessage: 'By clicking Continue you agree to the',
  },
  terms: {
    id: `${scope}.terms`,
    defaultMessage: 'Terms and Conditions & Privacy Policy',
  },
  creditCardRequired: {
    id: `${scope}.creditCardRequired`,
    defaultMessage: 'Please enter credit card number',
  },
  cardNameRequired: {
    id: `${scope}.cardNameRequired`,
    defaultMessage: 'Please enter name on card',
  },
  expiryMonthRequired: {
    id: `${scope}.expiryMonthRequired`,
    defaultMessage: 'Please enter expiry month',
  },
  expiryYearRequired: {
    id: `${scope}.expiryYearRequired`,
    defaultMessage: 'Please enter expiry year',
  },
  cvcRequired: {
    id: `${scope}.cvcRequired`,
    defaultMessage: 'Please enter cvc',
  },
  addressLineRequired: {
    id: `${scope}.addressLineRequired`,
    defaultMessage: 'Please enter Address Line'
  },
  addressCityRequired: {
    id: `${scope}.addressCityRequired`,
    defaultMessage: 'Please enter Address City'
  },
  addressCountryRequired: {
    id: `${scope}.addressCountryRequired`,
    defaultMessage: 'Please enter Address Country'
  },
  termRequired: {
    id: `${scope}.termRequired`,
    defaultMessage: 'Please agree to the Terms and Conditions, Privacy Policy',
  },
});