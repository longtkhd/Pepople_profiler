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
} from './constants';

export const initialState = {
  verifyCardLoading: false,
  verifyCardError: null,
  verifyCardResponse: null,
};

/* eslint-disable default-case, no-param-reassign */
const verifyCardSetupReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case VERIFY_CARD:
        draft.verifyCardError = null;
        draft.verifyCardLoading = true;
        draft.verifyCardResponse = null;
        break;
      case VERIFY_CARD_SUCCESS:
        draft.verifyCardError = null;
        draft.verifyCardLoading = false;
        draft.verifyCardResponse = action.response
        break;
      case VERIFY_CARD_ERROR:
        draft.verifyCardError = action.error;
        draft.verifyCardLoading = false;
        draft.verifyCardResponse = null;
        break;
      default:
        break;
    }
  });

export default verifyCardSetupReducer;
