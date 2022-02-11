/*
 *
 * SignUpPage reducer
 *
 */
import produce from 'immer';
import { 
  REGISTER_AGENCY_ADMIN,
  REGISTER_AGENCY_ADMIN_SUCCESS,
  REGISTER_AGENCY_ADMIN_ERROR,
  RESET
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  showVerify: false,
  agency: null,
};

/* eslint-disable default-case, no-param-reassign */
const signUpPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REGISTER_AGENCY_ADMIN:
        draft.loading = true;
        draft.error = null;
        break;
      case REGISTER_AGENCY_ADMIN_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.agency = action.response;
        draft.showVerify = true;
        break;
      case REGISTER_AGENCY_ADMIN_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
        case RESET:
        draft.error = null
        break;
      default:
        break;
    }
  });

export default signUpPageReducer;
