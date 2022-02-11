/*
 *
 * Create password reducer
 *
 */
import produce from 'immer';
import { 
  CREATE_PASSWORD,
  CREATE_PASSWORD_SUCCESS,
  CREATE_PASSWORD_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const createPasswordSetupReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_PASSWORD:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case CREATE_PASSWORD_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.response;
        break;
      case CREATE_PASSWORD_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      default:
        break;
    }
  });

export default createPasswordSetupReducer;
