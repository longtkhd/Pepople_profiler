/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL reducer
 *
 */
import produce from 'immer';
import {
  INIT_DELETE_CLIENT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAIL,
  CLEAN_UP_DELETE,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const deleteClientReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_DELETE_CLIENT:
        draft.loading = true;
        break;
      case DELETE_CLIENT_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case DELETE_CLIENT_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_UP_DELETE:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default deleteClientReducer;
