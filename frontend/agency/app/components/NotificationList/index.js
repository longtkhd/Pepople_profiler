/**
 *
 * NotificationList
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import updateNotification from 'containers/common_provider/update_notification/actions';

import { Button, Empty, Row, Col } from 'antd';
import CombinedCustom from 'components/CombinedCustom';
import NotificationListItem from './NotificationListItem';
import moment from 'moment';
import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function NotificationList(props) {
  const {
    notifications,
    onUpdateNotification,
    onCloseNotificationModal,
  } = props;

  const [toggleModal, setToggleModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const onClickNotification = notification => {
    setNotification(notification);
    const { id, status, content } = notification;
    setToggleModal(true);
    if (status == 0) {
      onUpdateNotification(id, { status: 1 });
    }
  }

  const onClickOk = (notification) => {
    setToggleModal(false);
    onCloseNotificationModal(notification);
  }

  return (
    <div className="notification-list-container">
      <div className="bold-text notification-list-header">
        <FormattedMessage {...messages.header} />
      </div>
      <div className="notification-list-content">
        {notifications?.length > 0 ? (
          notifications.map(notification =>
            <div
              key={notification.id}
              onClick={() => onClickNotification(notification)}
            >
              <NotificationListItem
                key={notification.id}
                content={notification.content}
                status={notification.status}
                createdDate={moment(notification.created_date).format('DD/MM/YYYY h:mma')}
              />
            </div>
          )
        ) : (
          <Empty />
        )}
      </div>
      <div className="notification-list-footer">
        <Link to='/notification-list'>
          <Button className="btn-viewAll">
            <FormattedMessage {...messages.viewAll} />
          </Button>
        </Link>
      </div>
      <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        showModal={() => setToggleModal(true)}
        title={notification?.title || <FormattedMessage {...messages.notificationModalTitle} />}
        content={<div dangerouslySetInnerHTML={{ __html: notification?.content }} />}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <Button
                type="primary"
                className="w-120"
                onClick={() => onClickOk(notification)}
              >
                {`OK`}
              </Button>
            </Col>
          </Row>,
        ]}
      />
    </div>
  );
}

NotificationList.propTypes = {
  notifications: PropTypes.array,
  onUpdateNotification: PropTypes.func,
  onCloseNotificationModal: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onUpdateNotification: (notificationId, data) => dispatch(updateNotification(notificationId, data)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(NotificationList);
