import { notification } from 'antd';

export const pushNotify = option => {
  notification[option?.type]({
    message: option?.message,
    description: option?.description,
    icon: option?.icon,
    duration: option?.duration
  });
};
