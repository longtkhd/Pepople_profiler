/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL reducer
 *
 */
import produce from 'immer';
import {
  INIT_EDIT_CLIENT,
  EDIT_CLIENT_SUCCESS,
  EDIT_CLIENT_FAIL,
  CLEAN_UP_EDIT_CLIENT,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const editClientReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_EDIT_CLIENT:
        draft.loading = true;
        break;
      case EDIT_CLIENT_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case EDIT_CLIENT_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_UP_EDIT_CLIENT:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default editClientReducer;
