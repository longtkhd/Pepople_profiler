/*
 *
 * Verify card reducer
 *
 */
import produce from 'immer';
import {
  VERIFY_CARD,
  VERIFY_CARD_SUCCESS,
  VERIFY_CARD_ERROR,
  UPDATE_CARD,
  UPDATE_CARD_SUCCESS,
  UPDATE_CARD_ERROR,
  CLEAR_UPDATE_CARD
} from './constants';

export const initialState = {
  verifyCardloading: false,
  verifyCardError: null,
  verifyCardResponse: null,
  updateCardError: null,
  updateCardLoading: false,
  updateCardResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const verifyCardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case VERIFY_CARD:
        draft.verifyCardError = null;
        draft.verifyCardloading = true;
        draft.verifyCardResponse = null;
        break;
      case VERIFY_CARD_SUCCESS:
        draft.verifyCardError = null;
        draft.verifyCardloading = false;
        draft.verifyCardResponse = action.payload.data
        break;
      case VERIFY_CARD_ERROR:
        draft.verifyCardError = action.error;
        draft.verifyCardloading = false;
        draft.verifyCardResponse = null;
        break;
      case UPDATE_CARD:
        draft.updateCardLoading = true;
        draft.updateCardResponse = null;
        draft.updateCardError = null;
        break;
      case UPDATE_CARD_SUCCESS:
        draft.updateCardLoading = false;
        draft.updateCardResponse = action.payload.data;
        draft.updateCardError = null;
        break;
      case UPDATE_CARD_ERROR:
        draft.updateCardLoading = false;
        draft.updateCardResponse = null;
        draft.updateCardError = action.error;
        break;
      case CLEAR_UPDATE_CARD:
        draft.updateCardLoading = false;
        draft.updateCardResponse = null;
        draft.updateCardError = null;
        draft.verifyCardError = null;
        draft.verifyCardloading = false;
        draft.verifyCardResponse = null
        break;
      default:
        break;
    }
  });

export default verifyCardReducer;
