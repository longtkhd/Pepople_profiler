import jwt_decoded from 'jwt-decode';
import Cookies from 'js-cookie';

export const tokenDecoded = (tokenName) => {
  let decoded;
  const token = Cookies.get(tokenName) || null;
  if (token) {
    decoded = jwt_decoded(token);
  }
  return decoded;
}
