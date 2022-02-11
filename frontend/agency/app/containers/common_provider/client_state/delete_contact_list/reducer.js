/*
 *
 * CLIENT DELETE CONTACT LIST DETAIL reducer
 *
 */
import produce from 'immer';
import {
  INIT_DELETE_CONTACT_DETAIL,
  DELETE_CONTACT_DETAIL_SUCCESS,
  DELETE_CONTACT_DETAIL_FAIL,
  CLEANUP_CONTACT_DETAIL_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const deleteContactDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_DELETE_CONTACT_DETAIL:
        draft.loading = true;
        break;
      case DELETE_CONTACT_DETAIL_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case DELETE_CONTACT_DETAIL_FAIL:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case CLEANUP_CONTACT_DETAIL_FAIL:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default deleteContactDetailReducer;
