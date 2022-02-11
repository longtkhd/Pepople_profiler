function clearNumber(value = '') {
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