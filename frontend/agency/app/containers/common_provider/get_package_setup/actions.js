import {
  GET_PACKAGE,
  GET_PACKAGE_SUCCESS,
  GET_PACKAGE_ERROR,
} from './constants';

import { getListPackageSetup } from 'services/api/agencyService';

function getPackageAction() {
  return {
    type: GET_PACKAGE,
  };
}

function getPackageSuccess(response) {
  return {
    type: GET_PACKAGE_SUCCESS,
    response,
  };
}

function getPackageError(error) {
  return {
    type: GET_PACKAGE_ERROR,
    error,
  };
}

export default (accessToken, agencyId) => {
  return async dispatch => {
    try {
      dispatch(getPackageAction());
      const response = await getListPackageSetup(accessToken, agencyId);
      if (response?.data?.success) {
        dispatch(getPackageSuccess(response.data));
      } else {
        dispatch(getPackageError(response?.data?.error || response?.message));
      }
    } catch (err) {
      dispatch(getPackageError(err.response?.data));
    }
  };
};
