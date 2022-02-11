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

export const getHeaderFileName = (response) => {
  const fileName = response.headers["content-disposition"] ?
    response.headers["content-disposition"].split("filename=")[1] : ``;
  return fileName
}
