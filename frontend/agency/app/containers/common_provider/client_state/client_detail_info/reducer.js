/*
 *
 * CLIENT DETAIL  reducer
 *
 */
import produce from 'immer';
import {
  INIT_GET_CLIENT_DETAIL,
  GET_CLIENT_DETAIL_SUCCESS,
  GET_CLIENT_DETAIL_FAIL,
  CLEAN_CLIENT_DETAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const clientDetailInfoReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_GET_CLIENT_DETAIL:
        draft.loading = true;
        break;
      case GET_CLIENT_DETAIL_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case GET_CLIENT_DETAIL_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEAN_CLIENT_DETAIL:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default clientDetailInfoReducer;
