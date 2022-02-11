/*
 *
 * CreateNewJob reducer
 *
 */
import produce from 'immer';
import {
  CREATE_NEW_INIT,
  CREATE_NEW_SUCCESS,
  CREATE_NEW_FAIL,
} from './constants';

export const initialState = {
  result: null,
  error: null,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const createNewJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_NEW_INIT:
        draft.loading = true;
        break;
      case CREATE_NEW_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CREATE_NEW_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
    }
  });

export default createNewJobReducer;
