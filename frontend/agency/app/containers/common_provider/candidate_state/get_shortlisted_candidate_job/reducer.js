/*
 *
 * shortlisted candidates list reducer
 *
 */
import produce from 'immer';
import {
  INIT_GET_SHORTLISTED_CANDIDATES,
  GET_SHORTLISTED_CANDIDATES_SUCCESS,
  GET_SHORTLISTED_CANDIDATES_FAIL,
  CLEAN_UP_SHORTLISTED_CANDIDATES,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const getShortlistedCandidateReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_GET_SHORTLISTED_CANDIDATES:
        draft.loading = true;
        break;
      case GET_SHORTLISTED_CANDIDATES_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case GET_SHORTLISTED_CANDIDATES_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_SHORTLISTED_CANDIDATES:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default getShortlistedCandidateReducer;
