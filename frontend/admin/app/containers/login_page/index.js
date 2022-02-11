/**
 *
 * LoginPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { push } from 'connected-react-router';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectUserData,
  makeSelectLoading,
  makeSelectError,
} from './selectors';
import loginUser, { clearUserData } from './actions';
import reducer from './reducer';
import { setToken, isValidToken } from 'services/authentication';
import { setAuthorizationHeader } from 'services/api/request';

import { Row, Col, Button } from 'antd';
import LoginForm from 'components/LoginForm';
import Footer from 'components/layout/Footer';
import LoginLayout from 'components/layout/LoginLayout';
import { Link } from 'react-router-dom';
import { openNotification } from 'utils/notification';
import Logo from 'components/Logo';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

export function LoginPage(props) {
  const { onLogin, gotToHomePage, clearUser, userData, loading, error } = props;

  useInjectReducer({ key: 'loginPage', reducer });

  const onSubmitLoginForm = values => {
    onLogin(values);
  };

  useEffect(() => {
    if (userData) {
      setToken(userData.token);
      setAuthorizationHeader();
      gotToHomePage();
    }
    return () => { }
  }, [userData])

  useEffect(() => {
    if (error) {
      openNotification(
        'error',
        <FormattedMessage {...messages.loginError.title} />,
        <FormattedMessage {...messages.loginError.content} />
      );
    }
    return () => { }
  }, [error])

  useEffect(() => {
    if (isValidToken()) {
      gotToHomePage();
    }
    return () => {
      clearUser();
    }
  }, [])


  return (
    <div className="wrapper-login h100">
      <Helmet>
        <title>Login Page</title>
        <meta name="description" content="Description of LoginPage" />
      </Helmet>
      <LoginLayout>
        <Row className="h100" justify='center'>
          <Col xl={18} lg={16} md={24} sm={24} xs={24}>
            <div className="left-layout">
              <div className="text">
                <div className="logo-link">
                  <Logo />
                </div>
                <div className="title">
                  <FormattedMessage {...messages.welcome} />
                </div>
                <div className="description">
                  <FormattedMessage {...messages.description} />
                </div>
              </div>
            </div>
          </Col>
          <Col xl={6} lg={8} md={24} sm={24} xs={24}>
            <div className="right-layout">
              <div className="login-layout">
                <div className="login-form-container">
                  <div className="login-header">
                    <FormattedMessage {...messages.welcomeBack} />
                  </div>
                  <LoginForm onSubmit={onSubmitLoginForm} loading={loading} />
                  {/* <div className="create-account">
                    <div className="or">
                      <FormattedMessage {...globalMessages.or} />
                    </div>
                    <Button type="default">
                      <Link to="sign-up">
                        <FormattedMessage {...messages.createAccount} />
                      </Link>
                    </Button>
                  </div> */}
                </div>
              </div>
              <div className="footer-layout">
                <Footer />
              </div>
            </div>
          </Col>
        </Row>
      </LoginLayout>
    </div>
  );
}

LoginPage.propTypes = {
  userData: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onLogin: PropTypes.func,
  clearUser: PropTypes.func,
  gotToHomePage: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userData: makeSelectUserData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogin: userData => dispatch(loginUser(userData)),
    clearUser: () => dispatch(clearUserData()),
    gotToHomePage: () => dispatch(push('/')),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(LoginPage);
