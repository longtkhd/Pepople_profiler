/*
 *
 * ClientDetailPage reducer
 *
 */
import produce from 'immer';
import {
  FETCH_CLIENT_DETAIL,
  RECEIVE_CLIENT_DETAIL,
  FAIL_CLIENT_DETAIL,
  CLEAN_CLIENT_DETAIL,
} from './constants';

export const initialState = {
  loadingPage: false,
  errorPage: null,
  resultPage: null,
  clientDetail: {
    loading: false,
    error: null,
    result: null,
  },
};

/* eslint-disable default-case, no-param-reassign */
const clientDetailPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_CLIENT_DETAIL:
        draft.clientDetail.loading = true;
        break;
      case RECEIVE_CLIENT_DETAIL:
        draft.clientDetail.loading = false;
        draft.clientDetail.result = action.payload;
        break;
      case FAIL_CLIENT_DETAIL:
        draft.clientDetail.loading = false;
        draft.clientDetail.error = action.payload;
        break;
      case CLEAN_CLIENT_DETAIL:
        draft.clientDetail.loading = false;
        draft.clientDetail.error = null;
        draft.clientDetail.result = null;
        break;
    }
  });

export default clientDetailPageReducer;
