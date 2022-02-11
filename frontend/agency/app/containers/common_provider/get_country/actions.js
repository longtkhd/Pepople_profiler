import {
  GET_COUNTRY,
  GET_COUNTRY_SUCCESS,
  GET_COUNTRY_FAILED,
} from './constants';
import { getCountries } from 'services/api/commonService';

function getCountry() {
  return {
    type: GET_COUNTRY,
  };
}

function getCountrySuccess(response) {
  return {
    type: GET_COUNTRY_SUCCESS,
    response,
  };
}

function getCountryFailed(error) {
  return {
    type: GET_COUNTRY_FAILED,
    error,
  };
}

export default () => {
  return async dispatch => {
    try {
      dispatch(getCountry());
      const response = await getCountries();
      dispatch(getCountrySuccess(response.data));
    } catch (err) {
      dispatch(getCountryFailed(err.response?.data));
    }
  };
};
