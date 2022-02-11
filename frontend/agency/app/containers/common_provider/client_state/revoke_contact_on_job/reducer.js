/*
 *
 * Client reducer
 *
 */
import produce from 'immer';
import {
  CLEAR_REVOKED,
  REVOKE_ALL,
  REVOKE_ALL_ERROR,
  REVOKE_ALL_SUCCESS,
  REVOKE_CLIENT,
  REVOKE_CLIENT_ERROR,
  REVOKE_CLIENT_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  revoked: null,
};

/* eslint-disable default-case, no-param-reassign */
const revokeJobClientReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REVOKE_ALL:
        draft.loading = true;
        draft.error = null;
        draft.revoked = false;
        break;
      case REVOKE_ALL_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.revoked = action.payload.data;
        break;
      case REVOKE_ALL_ERROR:
        draft.loading = false;
        draft.error = action.error;
        draft.revoked = false;
        break;
      case REVOKE_CLIENT:
        draft.loading = true;
        draft.error = null;
        draft.revoked = false;
        break;
      case REVOKE_CLIENT_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.revoked = action.payload.data;
        break;
      case REVOKE_CLIENT_ERROR:
        draft.loading = false;
        draft.error = action.error;
        draft.revoked = false;
        break;
      case CLEAR_REVOKED:
        draft.loading = false;
        draft.error = null;
        draft.revoked = false;
        break;
    }
  });

export default revokeJobClientReducer;
