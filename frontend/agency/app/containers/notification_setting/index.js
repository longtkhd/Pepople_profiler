/**
 *
 * NotificationSetting
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { getUserInfo } from 'services/authentication';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectNotificationSettingError,
  makeSelectNotificationSettingLoading,
  makeSelectNotificationSetting,
  makeSelectUpdateNotificationSettingLoading,
  makeSelectUpdateNotificationSettingError,
  makeSelectUpdateNotificationSettingResponse,
} from './selectors';
import { getNotificationSettingAction, updateNotificationSettingAction } from './actions';
import reducer from './reducer';
import messages from './messages';
import globalMessages from 'messages';

import { Button, Empty, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

import MainLayout from 'components/layout/MainLayout';
import Title from 'components/atoms/Title';
import ButtonBack from 'components/ButtonBack';
import NotificationSettingItem from './NotificationSettingItem';
import './styles.less';

import { openNotification } from 'utils/notification';
import { CONFIG } from 'constants/config';
import { cloneDeep } from 'lodash';

export function NotificationSetting(props) {
  useInjectReducer({ key: 'notificationSetting', reducer });

  const {
    history,
    getNotificationSetting,
    notificationSetting,
    notificationSettingLoading,
    notificationSettingError,
    updateNotificationSetting,
    updateNotificationSettingLoading,
    updateNotificationSettingError,
    updateNotificationSettingResponse,
  } = props;

  const [notifications, setNotifications] = useState([]);
  const userInfo = getUserInfo();
   const userRole = userInfo?.role;

  const onSetWebsiteNotification = (index, value) => {
    const cloneData = cloneDeep(notifications);
    cloneData[index].by_website = value;
    setNotifications(cloneData);
  }

  const onSetEmailNotification = (index, value) => {
    const cloneData = cloneDeep(notifications);
    cloneData[index].by_email = value;
    setNotifications(cloneData);
  }

  const updateAll = (status) => {
    const cloneData = cloneDeep(notifications);
    let newNoti = cloneData.map(noti => {
      noti.by_website = status;
      noti.by_email = status;
      return noti;
    })
    setNotifications(newNoti);
  }

  const updateNotificationSettings = () => {
    updateNotificationSetting(notifications);
  }

  const showConfirmDisableAll = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: <FormattedMessage {...globalMessages.areYouSure} />,
      content: <FormattedMessage {...messages.disableAllModalContent} />,
      okText: <FormattedMessage {...messages.disableAll} />,
      onOk() {
        updateAll(false);
      },
    })
  }

  useEffect(() => {
    if (notificationSetting?.data?.length > 0) {
      setNotifications(cloneDeep(notificationSetting.data));
    } else {
      if (userRole) {
        const notificationSettings = userRole === 'agency' ? CONFIG.DEFAULT_AGENCY_NOTIFICATIONS_SETTINGS : CONFIG.DEFAULT_RECRUITER_NOTIFICATIONS_SETTINGS;
        setNotifications(cloneDeep(notificationSettings));
      }
    }
    return () => { }
  }, [notificationSetting])

  useEffect(() => {
    if (updateNotificationSettingResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.updateNotiSuccess} />);
      setNotifications(cloneDeep(updateNotificationSettingResponse.data))
    }
    return () => { }
  }, [updateNotificationSettingResponse])

  useEffect(() => {
    const error = notificationSettingError || updateNotificationSettingError
    if (error) {
      openNotification('error', error.message);
    }
    return () => { }
  }, [notificationSettingError, updateNotificationSettingError])

  useEffect(() => {
    getNotificationSetting();
    return () => { }
  }, [])

  return (
    <div>
      <Helmet>
        <title>Notification Settings</title>
        <meta name="description" content="Description of NotificationSetting" />
      </Helmet>
      <MainLayout loading={notificationSettingLoading || updateNotificationSettingLoading}>
        <ButtonBack history={history} />
        <div className="manage-notification-container">
          <div className="mb-24">
            <Title>
              {userRole === "agency" ? <FormattedMessage {...messages.header} /> : <FormattedMessage {...messages.headerRecruiter} />}
            </Title>
          </div>
          {
            notifications.length > 0 ? (
              <div className="notification-setting-list-layout mt-24">
                <div className="notification-setting-actions-layout">
                  <div className="notification-setting-actions">
                    <Button type="default" className="w-150" onClick={() => updateAll(true)}>
                      <FormattedMessage {...messages.enableAll} />
                    </Button>
                    <Button type="default" className="w-150" onClick={showConfirmDisableAll}>
                      <FormattedMessage {...messages.disableAll} />
                    </Button>
                  </div>
                </div>
                <div className="notification-setting-list mb-24 mt-24">
                  {notifications.map((notification, index) => {
                    return (
                      <NotificationSettingItem
                        key={index}
                        notificationName={notification.notify}
                        defaultWebsiteNotification={notification.by_website}
                        defaultEmailNotification={notification.by_email}
                        setWebsiteNotification={(value) => onSetWebsiteNotification(index, value)}
                        setEmailNotification={value => onSetEmailNotification(index, value)}
                      />
                    )
                  })}
                </div>
                <div className="notification-setting-button text-center">
                  <Button
                    type="primary"
                    className="w-150"
                    onClick={updateNotificationSettings}
                    loading={updateNotificationSettingLoading}
                  >
                    <FormattedMessage {...globalMessages.update} />
                  </Button>
                </div>
              </div>
            ) : (
              <Empty />
            )
          }
        </div>
      </MainLayout>
    </div>
  );
}

NotificationSetting.propTypes = {
  notificationSetting: PropTypes.object,
  notificationSettingLoading: PropTypes.bool,
  notificationSettingError: PropTypes.object,
  getNotificationSetting: PropTypes.func,
  updateNotificationSettingResponse: PropTypes.object,
  updateNotificationSettingLoading: PropTypes.bool,
  updateNotificationSettingError: PropTypes.object,
  updateNotificationSetting: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  notificationSetting: makeSelectNotificationSetting(),
  notificationSettingLoading: makeSelectNotificationSettingLoading(),
  notificationSettingError: makeSelectNotificationSettingError(),
  updateNotificationSettingLoading: makeSelectUpdateNotificationSettingLoading(),
  updateNotificationSettingError: makeSelectUpdateNotificationSettingError(),
  updateNotificationSettingResponse: makeSelectUpdateNotificationSettingResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getNotificationSetting: () => dispatch(getNotificationSettingAction()),
    updateNotificationSetting: data => dispatch(updateNotificationSettingAction(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(NotificationSetting);
