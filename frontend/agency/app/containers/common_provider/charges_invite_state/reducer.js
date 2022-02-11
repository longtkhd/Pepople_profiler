
import produce from 'immer';
import {
  CHARGES_INVITE,
  CHARGES_INVITE_SUCCESS,
  CHARGES_INVITE_ERROR,
  CLEAN_CHARGES_INVITE,
} from './constants'

export const initialState = {
  chargesInvite: false,
  chargesLoading: false,
  chargesError: null
};

/* eslint-disable default-case, no-param-reassign */
const chargesInviteReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHARGES_INVITE:
        draft.chargesLoading = true;
        draft.chargesInvite = false;
        draft.chargesError = null;
        break;
      case CHARGES_INVITE_SUCCESS:
        draft.chargesInvite = action.payload.data;
        draft.chargesLoading = false;
        draft.chargesError = null;
        break;
      case CHARGES_INVITE_ERROR:
        draft.chargesLoading = false;
        draft.chargesInvite = false;
        draft.chargesError = action.error
        break;
      case CLEAN_CHARGES_INVITE:
        draft.chargesLoading = false;
        draft.chargesError = null;
        draft.chargesInvite = false;
        break;
      default:
        break;
    }
  });

export default chargesInviteReducer;
