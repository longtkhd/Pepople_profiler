/*
 *
 * get candidate detail reducer
 *
 */
import produce from 'immer';
import {
  INIT_GET_CANDIDATE_DETAIL,
  GET_CANDIDATE_DETAIL_SUCCESS,
  GET_CANDIDATE_DETAIL_FAIL,
  CLEAN_UP_CANDIDATE_DETAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const candidateDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_GET_CANDIDATE_DETAIL:
        draft.loading = true;
        break;
      case GET_CANDIDATE_DETAIL_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case GET_CANDIDATE_DETAIL_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_CANDIDATE_DETAIL:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default candidateDetailReducer;
