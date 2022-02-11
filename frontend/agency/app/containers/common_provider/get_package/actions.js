import {
  GET_PACKAGE,
  GET_PACKAGE_SUCCESS,
  GET_PACKAGE_ERROR,
} from './constants';

import { getListPackage } from 'services/api/agencyService';

function getPackageAction() {
  return {
    type: GET_PACKAGE,
  };
}

function getPackageSuccess(payload) {
  return {
    type: GET_PACKAGE_SUCCESS,
    payload,
  };
}

function getPackageError(error) {
  return {
    type: GET_PACKAGE_ERROR,
    error,
  };
}

export default agencyId => {
  return async dispatch => {
    try {
      dispatch(getPackageAction());
      const response = await getListPackage(agencyId);
      if (response && response?.data?.success) {
        dispatch(getPackageSuccess(response.data));
      } else {
        dispatch(getPackageError(response?.data?.error || response?.message));
      }
    } catch (err) {
        dispatch(getPackageError(err.response?.data));
    }
  };
};
