/**
 *
 * RecruiterSettingOptions
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Col, Row } from 'antd';

import AgencySettingIcon from 'images/icons/group-21.svg';
import PaymentSettingIcon from 'images/icons/group-22.svg';
import NotificationSettingIcon from 'images/icons/shape.svg';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectRecruiterSettingOptions from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout';
import SettingsChildren from 'components/SettingsChildren'
import envelope from 'images/icons/envelope.png'
import shape from 'images/icons/shape.png'
import Title from 'components/atoms/Title'
import ButtonWrapper from 'components/atoms/Button'
import Button from 'components/atoms/Button';
import { Link } from 'react-router-dom';
import './styles.less'



export function RecruiterSettingOptions({ history }) {
  useInjectReducer({ key: 'recruiterSettingOptions', reducer });

  const handleRedirect = () => {
    history.push('./manage-notification-settings')
  }

  return (
    <div>
      <Helmet>
        <title>RecruiterSettingOptions</title>
        <meta
          name="description"
          content="Description of RecruiterSettingOptions"
        />
      </Helmet>
      <MainLayout>
        <Row className="setting-container">
          <Col span={14} offset={5}>
            <h1>
              <FormattedMessage {...messages.header} />
            </h1>

            <div className="setting-item">
              <img src={envelope} className="setting-item__icon" />
              <div className="setting-item__name">
                <FormattedMessage {...messages.notificationSettings} />
              </div>
              <Link to="manage-notification-settings" className="setting-item__button">
                <FormattedMessage {...messages.manage} />
              </Link>
            </div>

            <div className="setting-item">
              <img src={shape} className="setting-item__icon" />
              <div className="setting-item__name">
                <FormattedMessage {...messages.emailTemplateSetting} />
              </div>
              <Link to="/recruiter-email-settings" className="setting-item__button">
                <FormattedMessage {...messages.manage} />
              </Link>
            </div>


          </Col>
        </Row>
      </MainLayout>

    </div>
  );
}

RecruiterSettingOptions.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruiterSettingOptions: makeSelectRecruiterSettingOptions(),
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
)(RecruiterSettingOptions);
