/*
 *
 * CLIENT ADD MORE CONTACT TO JOB reducer
 *
 */
import produce from 'immer';
import {
  INIT_ADD_MORE_CONTACT_TO_JOB,
  ADD_MORE_CONTACT_TO_JOB_SUCCESS,
  ADD_MORE_CONTACT_TO_JOB_FAIL,
  CLEAN_UP_ADD_MORE_CONTACT,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  result: null,
};

/* eslint-disable default-case, no-param-reassign */
const addMoreContactToJobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INIT_ADD_MORE_CONTACT_TO_JOB:
        draft.loading = true;
        break;
      case ADD_MORE_CONTACT_TO_JOB_SUCCESS:
        draft.loading = false;
        draft.result = action.payload;
        break;
      case ADD_MORE_CONTACT_TO_JOB_FAIL:
        draft.loading = false;
        draft.error = action.payload;
        break;
      case CLEAN_UP_ADD_MORE_CONTACT:
        draft.loading = false;
        draft.error = null;
        draft.result = null;
        break;
    }
  });

export default addMoreContactToJobReducer;
