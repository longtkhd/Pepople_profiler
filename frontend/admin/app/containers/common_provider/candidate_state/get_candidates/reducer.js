/*
 *
 * candidates list reducer
 *
 */
import produce from 'immer';
import {
  INIT_GET_CANDIDATES,
  GET_CANDIDATE_SUCCESS,
  GET_CANDIDATE_FAIL,
  CLEAN_UP_CANDIDATE,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const listCandidateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_GET_CANDIDATES:
        draft.loading = true;
        break;
      case GET_CANDIDATE_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case GET_CANDIDATE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_CANDIDATE:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default listCandidateReducer;
