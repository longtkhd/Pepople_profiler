/*
 *
 * Resend verify reducer
 *
 */
import produce from 'immer';
import { 
  RESEND_VERIFY,
  RESEND_VERIFY_SUCCESS,
  RESEND_VERIFY_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const resendVerifyReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RESEND_VERIFY:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case RESEND_VERIFY_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.payload.data
        break;
      case RESEND_VERIFY_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      default:
        break;
    }
  });

export default resendVerifyReducer;
