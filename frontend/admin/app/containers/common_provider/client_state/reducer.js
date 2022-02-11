/*
 *
 * Client reducer
 *
 */
import produce from 'immer';
import {
  FETCH_CLIENT_LIST,
  RECEIVE_CLIENT_LIST,
  FAIL_CLIENT_LIST,
  CLEAN_CLIENT_LIST,
  FETCH_CONTACT_LIST_DETAIL,
  RECEIVE_CONTACT_LIST_DETAIL,
  FAIL_CONTACT_LIST_DETAIL,
  CLEAN_CONTACT_LIST_DETAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  clientData: null,
  contactListDetail: {
    loading: false,
    error: null,
    result: null,
  },
};

/* eslint-disable default-case, no-param-reassign */
const editContactReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_CLIENT_LIST:
        draft.loading = true;
        break;
      case RECEIVE_CLIENT_LIST:
        draft.loading = false;
        draft.clientData = action.payload;
        break;
      case FAIL_CLIENT_LIST:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_CLIENT_LIST:
        draft.loading = false;
        draft.error = null;
        draft.clientData = null;
        break;
      case FETCH_CONTACT_LIST_DETAIL:
        draft.contactListDetail.loading = true;
        break;
      case RECEIVE_CONTACT_LIST_DETAIL:
        draft.contactListDetail.loading = false;
        draft.contactListDetail.result = action.payload;
        break;
      case FAIL_CONTACT_LIST_DETAIL:
        draft.contactListDetail.loading = false;
        draft.contactListDetail.error = action.payload;
        break;
      case CLEAN_CONTACT_LIST_DETAIL:
        draft.contactListDetail.loading = false;
        draft.contactListDetail.error = false;
        draft.contactListDetail.result = null;
        break;
    }
  });

export default editContactReducer;
