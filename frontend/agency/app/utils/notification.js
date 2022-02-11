import { notification } from 'antd';

export const openNotification = (type, message, description) => {
  type = type || 'info';
  notification[type]({
    message,
    description
  });
};