import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import {
  makeSelectGetNotificationListResponse,
} from 'containers/common_provider/get_notification/selectors';
import getNotificationListAction from 'containers/common_provider/get_notification/actions';
import { makeSelectGetServerNotification } from 'containers/common_provider/update_server_notification/selectors';
import { makeSelectUpdateNotificationResponse } from 'containers/common_provider/update_notification/selectors';

import { Popover, Badge } from 'antd';
import { MenuOutlined, SearchOutlined, BellOutlined} from '@ant-design/icons';
import Menu from '../Menu';
import NotificationList from 'components/NotificationList';
import { getUserInfo } from 'services/authentication';
import { getLastSeenNotification, setLastSeenNotification } from 'services/notification';
import './styles.less';

import { cloneDeep } from 'lodash';

function Nav(props){
  const {
    getNotificationList,
    notificationListResponse,
    serverNotification,
    updateNotificationResponse
  } = props;

  const userInfo = getUserInfo();
  const [notifications, setNotifications] = useState([]);
  const [unReadNoti, setUnReadNoti] = useState(0);

  const init = () => {
    const lastSeenNotification = getLastSeenNotification(userInfo.id);
    const params = { 
      sort_field : 'created_date',
      sort_direction: -1,
      is_deleted: false
    };
    if(lastSeenNotification){
      params.lastSeenNotification = lastSeenNotification
    }
    getNotificationList(params);
  }

  const dismissNotification = () => {
    setLastSeenNotification(userInfo.id);
    setUnReadNoti(0);
  }

  const onCloseNotificationModal = notification => {
    if (notification?.status == 0) {
      init();
    }
  }

  const onDismissNotification = e => {
    e.preventDefault();
    e.stopPropagation();
    if (unReadNoti == 0) return;
    dismissNotification();
  }

  useEffect(() => {
    if (notificationListResponse?.success) {
      const noti = notificationListResponse.data?.notifications || [];
    
      const unReadNoti = notificationListResponse.data?.un_read_count;
      setUnReadNoti(unReadNoti);
      setNotifications(noti.slice(0, 5));
    }
  }, [notificationListResponse])

  useEffect(() => {
    if (serverNotification) {
      if (serverNotification.receiver_id == userInfo.id) {
        init();
      }
    }
    return () => { }
  }, [serverNotification])

  useEffect(() => {
    init();
  }, [])

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Badge
            count={unReadNoti}
            overflowCount={10}
          >
            <Popover 
              placement="bottomRight" 
              content={<NotificationList notifications={notifications} onCloseNotificationModal={onCloseNotificationModal} />} 
              trigger="click"
              overlayClassName="notification-list-popover"
              onClick={onDismissNotification} 
            >
              <BellOutlined />
            </Popover>
          </Badge>
        </li>
        <li className="navbar-item menu">
          <Popover placement="bottomRight" content={<Menu />} trigger="click">
            <MenuOutlined />
          </Popover>
        </li>
      </ul>
    </nav>
  )
}

Nav.propTypes = {
  getNotificationList: PropTypes.func,
  notificationListResponse: PropTypes.object,
  serverNotification: PropTypes.object,
  updateNotificationResponse: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  notificationListResponse: makeSelectGetNotificationListResponse(),
  serverNotification: makeSelectGetServerNotification(),
  updateNotificationResponse: makeSelectUpdateNotificationResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getNotificationList: data => dispatch(getNotificationListAction(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo
)(Nav)
