import produce from 'immer';

import {
  GET_PACKAGE,
  GET_PACKAGE_SUCCESS,
  GET_PACKAGE_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  packageList: null,
};

const getPackageSetupReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_PACKAGE:
        draft.error = null;
        draft.loading = true;
        draft.packageList = null;
        break;
      case GET_PACKAGE_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.packageList = action.response?.data;
        break;
      case GET_PACKAGE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.packageList = null;
        break;
      default:
        break;
    }
  });

export default getPackageSetupReducer;
