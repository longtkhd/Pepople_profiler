import React from 'react';
import PropTypes from 'prop-types';
import './styles.less';

function NotificationListItem(props) {
  const {
    content,
    createdDate,
    status,
  } = props;

  return (
    <div className={`notification-list-item ${status == 0 ? "notification-list-item-unread" : "notification-list-item-read"}`}>
      <div className="notification-list-item-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className="notification-list-item-time">
        {createdDate}
      </div>
    </div>
  )
}

NotificationListItem.props = {
  content: PropTypes.string.isRequired,
  status: PropTypes.number,
  createdDate: PropTypes.any
}

export default NotificationListItem
