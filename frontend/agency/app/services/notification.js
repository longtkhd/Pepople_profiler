export const getLastSeenNotification = (current_user_id) => {
  const o = localStorage.getItem(`${current_user_id}lastSeenNotification`);
  if (o) {
    return JSON.parse(o);
  }
};

export const setLastSeenNotification = (current_user_id) => {
  localStorage.setItem(`${current_user_id}lastSeenNotification`, (new Date()).getTime());
}