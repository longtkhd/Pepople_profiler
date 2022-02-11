/*
 *
 * SetupAgencyPage reducer
 *
 */
import produce from 'immer';
import { 
  CHECK_TOKEN,
  CHECK_TOKEN_SUCCESS,
  CHECK_TOKEN_ERROR
} from './constants';

export const initialState = {
  loading: false,
  checkTokenError: null,
  user: null,
  setupToken: null,
};

/* eslint-disable default-case, no-param-reassign */
const setupAgencyPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHECK_TOKEN:
        draft.loading = true;
        draft.checkTokenError = null;
        break;
      case CHECK_TOKEN_SUCCESS:
        draft.loading = false;
        draft.user = action.payload.data?.user;
        draft.setupToken = action.payload.data?.token;
        break;
      case CHECK_TOKEN_ERROR:
        draft.checkTokenError = action.error;
        draft.loading = false;
        break;
      default:
        break;
    }
  });

export default setupAgencyPageReducer;
