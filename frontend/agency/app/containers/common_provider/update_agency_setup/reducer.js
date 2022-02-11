/*
 *
 * Update agency reducer
 *
 */
import produce from 'immer';
import { 
  UPDATE_AGENCY,
  UPDATE_AGENCY_SUCCESS,
  UPDATE_AGENCY_ERROR,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
};

/* eslint-disable default-case, no-param-reassign */
const updateAgencySetupReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_AGENCY:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        break;
      case UPDATE_AGENCY_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.response = action.response
        break;
      case UPDATE_AGENCY_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
      default:
        break;
    }
  });

export default updateAgencySetupReducer;
