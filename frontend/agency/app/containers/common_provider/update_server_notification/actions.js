import {
  UPDATE_SERVER_NOTIFICATION,
} from './constants';

function updateServerNotification(notification) {
  return {
    type: UPDATE_SERVER_NOTIFICATION,
    notification
  };
}

export default (data) => {
  return async dispatch => {
    dispatch(updateServerNotification(data));
  };
};
