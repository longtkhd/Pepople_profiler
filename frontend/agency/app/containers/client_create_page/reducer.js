/*
 *
 * ClientCreatePage reducer
 *
 */
import produce from 'immer';
import {
  CREATE_CLIENT_INIT,
  CREATE_CLIENT_SUCCESS,
  CREATE_CLIENT_ERROR,
  CLEAN_UP_DATA,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const clientCreatePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_CLIENT_INIT:
        draft.loading = true;
        break;
      case CREATE_CLIENT_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CREATE_CLIENT_ERROR:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_UP_DATA:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default clientCreatePageReducer;
