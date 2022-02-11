/*
 *
 * Update subscription reducer
 *
 */
import produce from 'immer';
import { 
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_SUCCESS,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_DOWNGRADE_NOTI,
} from './constants';

export const initialState = {
  loading: false,
  error: null,
  response: null,
  isShowDowngradeNoti: false,
};

/* eslint-disable default-case, no-param-reassign */
const updateSubscriptionReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_SUBSCRIPTION:
        draft.error = null;
        draft.loading = true;
        draft.response = null;
        draft.isShowDowngradeNoti = false;
        break;
      case UPDATE_SUBSCRIPTION_SUCCESS:
        draft.error = null;
        draft.loading = false;
        draft.isShowDowngradeNoti = false;
        draft.response = action.payload
        break;
      case UPDATE_SUBSCRIPTION_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.response = null;
        break;
      case SHOW_DOWNGRADE_NOTI:
        draft.error = null,
        draft.loading = false;
        draft.response = null;
        draft.isShowDowngradeNoti = action.payload;
      default:
        break;
    }
  });

export default updateSubscriptionReducer;
