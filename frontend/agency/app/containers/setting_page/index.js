/**
 *
 * SettingPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import messages from './messages';

import { createStructuredSelector } from 'reselect';
import { makeSelectUserInfo } from 'containers/common_provider/get_user_info/selectors';

import MainLayout from 'components/layout/MainLayout';
import { Col, Row } from 'antd';

import AgencySettingIcon from 'images/icons/group-21.svg';
import PaymentSettingIcon from 'images/icons/group-22.svg';
import NotificationSettingIcon from 'images/icons/shape.svg';
import EmailIcon from 'images/icons/envelope.png'
import './styles.less';

export function SettingPage(props) {
  const { users } = props;

  useEffect(() => { }, [users]);

  return (
    <div>
      <Helmet>
        <title>Settings</title>
        <meta
          name="description"
          content="Description of SettingPage"
        />
      </Helmet>
      <MainLayout>
        <Row className="setting-container">
          <Col
            xxl={{ span: 10, offset: 7 }}
            lg={{ span: 14, offset: 5 }}
            sm={{ span: 20, offset: 2}}
            xs={{ span: 24 }}
          >
            <h1>
              <FormattedMessage {...messages.header} />
            </h1>

            {users?.role === 'agency' ? (
              <>
                <div className="setting-item">
                  <img src={AgencySettingIcon} className="setting-item__icon" />
                  <div className="setting-item__name">
                    <FormattedMessage {...messages.agencySetting} />
                  </div>
                  <Link to="/agency-info" className="setting-item__button">
                    <FormattedMessage {...messages.manage} />
                  </Link>
                </div>

                <div className="setting-item">
                  <img
                    src={PaymentSettingIcon}
                    className="setting-item__icon"
                  />
                  <div className="setting-item__name">
                    <FormattedMessage {...messages.paymentMedthodSetting} />
                  </div>
                  <Link to="/payment-method" className="setting-item__button">
                    <FormattedMessage {...messages.manage} />
                  </Link>
                </div>

                <div className="setting-item">
                  <img
                    src={NotificationSettingIcon}
                    className="setting-item__icon"
                  />
                  <div className="setting-item__name">
                    <FormattedMessage {...messages.notificationSetting} />
                  </div>
                  <Link
                    to="notification-settings"
                    className="setting-item__button"
                  >
                    <FormattedMessage {...messages.manage} />
                  </Link>
                </div>

                <div className="setting-item">
                  <img src={EmailIcon} className="setting-item__icon" />
                  <div className="setting-item__name">
                    <FormattedMessage {...messages.emailTemplateSetting} />
                  </div>
                  <Link to="/recruiter-email-settings" className="setting-item__button">
                    <FormattedMessage {...messages.manage} />
                  </Link>
                </div>
              </>
            ) : (
                <>
                  <div className="setting-item">
                    <img
                      src={NotificationSettingIcon}
                      className="setting-item__icon"
                    />
                    <div className="setting-item__name">
                      <FormattedMessage {...messages.notificationSetting} />
                    </div>
                    <Link
                      to="notification-settings"
                      className="setting-item__button"
                    >
                      <FormattedMessage {...messages.manage} />
                    </Link>
                  </div>

                  <div className="setting-item">
                    <img src={EmailIcon} className="setting-item__icon" />
                    <div className="setting-item__name">
                      <FormattedMessage {...messages.emailTemplateSetting} />
                    </div>
                    <Link to="/recruiter-email-settings" className="setting-item__button">
                      <FormattedMessage {...messages.manage} />
                    </Link>
                  </div>
                </>
              )}
          </Col>
        </Row>
      </MainLayout>
    </div>
  );
}

SettingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUserInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SettingPage);
