/*
 *
 * CLIENT CREATE CONTACT  reducer
 *
 */
import produce from 'immer';
import {
  INIT_CREATE_CONTACT_CLIENT,
  CREATE_CONTACT_CLIENT_SUCCESS,
  CREATE_CONTACT_CLIENT_FAIL,
  CLEAN_CREATE_CONTACT_CLIENT,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const createContactClientReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_CREATE_CONTACT_CLIENT:
        draft.loading = true;
        break;
      case CREATE_CONTACT_CLIENT_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CREATE_CONTACT_CLIENT_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_CREATE_CONTACT_CLIENT:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default createContactClientReducer;
