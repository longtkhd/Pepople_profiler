import produce from 'immer';
import {
  UPDATE_SERVER_NOTIFICATION,
} from './constants';

export const initialState = {
  serverNotification: null
};

const updateServerNotificationReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_SERVER_NOTIFICATION:
        draft.serverNotification = action.notification;
        break;
      default:
        break;
    }
  });

export default updateServerNotificationReducer;
