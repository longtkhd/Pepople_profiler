/**
 *
 * NotificationSettingItem
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Checkbox } from 'antd';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './styles.less';

function NotificationSettingItem(props) {
  const { 
    notificationName,
    defaultWebsiteNotification,
    defaultEmailNotification,
    setWebsiteNotification,
    setEmailNotification,
  } = props;

  const onChangeWebsiteNotification = (e) => {
    setWebsiteNotification(e.target.checked);
  }

  const onChangeEmailNotification = (e) => {
    setEmailNotification(e.target.checked);
  }

  return (
    <Row className="notification-setting-item">
      <Col md={12} sm={24} xs={24}>
        <div className="bold-text notification-name">
          {notificationName}
        </div>
      </Col>
      <Col md={6} sm={12} xs={24}>
        <div className="notification-checkbox">
          <Checkbox onChange={onChangeWebsiteNotification} checked={defaultWebsiteNotification}>
            <FormattedMessage {...messages.websiteNotification} />
          </Checkbox>
        </div>
      </Col>
      <Col md={6} sm={12} xs={24}>  
        <div className="notification-checkbox">
          <Checkbox onChange={onChangeEmailNotification} checked={defaultEmailNotification}>
            <FormattedMessage {...messages.emailNotification} />
          </Checkbox>
        </div>
      </Col>
    </Row>
  );
}

NotificationSettingItem.propTypes = {
  notificationName: PropTypes.string.isRequired,
  defaultWebsiteNotification: PropTypes.bool.isRequired,
  defaultEmailNotification: PropTypes.bool.isRequired,
  setWebsiteNotification: PropTypes.func,
  setEmailNotification: PropTypes.func,
};

export default memo(NotificationSettingItem);
