import { CONFIG } from 'constants/config';

export function clearNumber(value = '') {
  return value.replace(/\D+/g, '');
}

export function formatCreditCardNumber(value) {
  if (!value) {
    return value;
  }
  const clearValue = clearNumber(value);
  let nextValue;
  nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
    4,
    8,
  )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`;

  return nextValue.trim();
}

export function formatExpirationMonth(value) {
  const clearValue = clearNumber(value);
  if (parseInt(clearValue) <= 12 && parseInt(clearValue) > 9) {
    return `${clearValue.slice(0, 2)}`;
  }
  if (parseInt(clearValue) > 12) return '12';
  return clearValue;
}

export function getDisplayMonth(value){
    if(parseInt(value) <= 9) return `0${value}`;
    return value;
}

export function getHideCreditCard(value) {
  return `xxxx xxxx xxxx ${value.slice(12, value.length)}`
}

export function getTotalPrice(price, billingType) {
  let total = 0;
  if (price) {
    if (billingType == 0) {
      total = Math.round((price  + Number.EPSILON) * 100) / 100;
    } else {
      total = Math.round(((price * 12) + Number.EPSILON) * 100) / 100;
    }
  }
  return total;
}

export function getTotalTax(price, billingType) {
  let tax = 0;
  if (price) {
    if (billingType == 0) {
      let result = price * (CONFIG.GST_TAX / 100);
      tax = Math.round((result + Number.EPSILON) * 100) / 100;
    } else {
      let result = price * (CONFIG.GST_TAX / 100) * 12;
      tax = Math.round((result + Number.EPSILON) * 100) / 100;
    }
  }
  return tax;
}
