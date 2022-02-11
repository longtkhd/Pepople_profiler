/*
 *
 * GET JOBS reducer
 *
 */
import produce from 'immer';
import {
  EDIT_JOB_INIT,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_FAIL,
  CLEAN_EDIT_JOB,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const editJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case EDIT_JOB_INIT:
        draft.loading = true;
        break;
      case EDIT_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case EDIT_JOB_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_EDIT_JOB:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default editJobReducer;
