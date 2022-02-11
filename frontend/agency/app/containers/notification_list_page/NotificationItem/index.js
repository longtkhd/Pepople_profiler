/**
 *
 * NotificationItem
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import globalMessages from 'messages';
import moment from 'moment';

import './styles.less';

function NotificationItem(props) {

  const {
    id,
    content,
    status,
    createdDate,
    onDelete,
  } = props;

  const deleteNotification = (notificationId) => {
    onDelete(notificationId);
  }

  return (
    <div className={`notification-item-container ${status == 0 ? "notification-item-read" : "notification-item-unread"}`}>
      <div className="notification-item-content-layout">
        <div className="notification-item-content">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="notification-created-date">
          {moment(createdDate).format('DD/MM/YYYY h:mma')}
        </div>
      </div>
      <div className="notification-item-action">
        <Button 
          type="link" 
          icon={<i class="action-icon far fa-trash-alt" />}
          className="notification-item-button flex-align-center"
          onClick={(e) =>   {
            e.stopPropagation()
            deleteNotification(id)
          } }
        >
          <FormattedMessage {...globalMessages.delete} />
        </Button> 
      </div>
    </div>
  );
}

NotificationItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  createdDate: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default memo(NotificationItem);
