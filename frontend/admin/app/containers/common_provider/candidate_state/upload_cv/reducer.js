/*
 *
 * candidates upload reducer
 *
 */
import produce from 'immer';
import {
  CANDIDATE_UPLOAD_INIT,
  CANDIDATE_UPLOAD_SUCCESS,
  CANDIDATE_UPLOAD_FAIL,
  CANDIDATE_CLEAN_UP,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const clientReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CANDIDATE_UPLOAD_INIT:
        draft.loading = true;
        break;
      case CANDIDATE_UPLOAD_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CANDIDATE_UPLOAD_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CANDIDATE_CLEAN_UP:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default clientReducer;
