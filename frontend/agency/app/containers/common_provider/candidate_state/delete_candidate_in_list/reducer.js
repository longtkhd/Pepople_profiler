/*
 *
 * delete candidate  reducer
 *
 */
import produce from 'immer';
import {
  INIT_DELETE_CANDIDATE,
  DELETE_CANDIDATE_SUCCESS,
  DELETE_CANDIDATE_FAIL,
  CLEAN_UP_DELETE_CANDIDATE,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const deleteCandidateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_DELETE_CANDIDATE:
        draft.loading =  true;
        break;
      case DELETE_CANDIDATE_SUCCESS:
        draft.loading =  false;
        draft.result = action.payload;
        break;
      case DELETE_CANDIDATE_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_DELETE_CANDIDATE:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default deleteCandidateReducer;
