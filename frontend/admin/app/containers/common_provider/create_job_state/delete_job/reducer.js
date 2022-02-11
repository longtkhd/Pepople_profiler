/*
 *
 * DELETE JOB reducer
 *
 */
import produce from 'immer';
import {
  DELETE_JOB_INIT,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAIL,
  CLEAN_DELETE_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const deleteJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_JOB_INIT:
        draft.loading = true;
        break;
      case DELETE_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case DELETE_JOB_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_DELETE_JOB:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default deleteJobReducer;
