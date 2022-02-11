/**
 *
 * ResetPassword
 *
 */

import React, { memo ,useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Row, Col, Button } from 'antd';
import RegisterLayout from 'components/layout/RegisterLayout';
import RegisterFooter from 'components/layout/RegisterFooter';
import CreatePasswordForm from 'components/CreatePasswordForm';
import messages from './messages';
import globalMessages from 'messages';
import {
  makeSelectCheckTokenLoading,
  makeSelectCheckTokenError,
  makeSelectCheckTokenResponse,
  makeSelectResetPasswordLoading,
  makeSelectResetPasswordError,
  makeSelectResetPasswordResponse,
  makeSelectResetPassword
} from './selectors';
import {
  resetPassword,
  checkTokenExist,
} from './actions';
import qs from 'qs';
import './styles.less'
import { openNotification } from 'utils/notification';


export function ResetPassword(props) {
  useInjectReducer({ key: 'resetPassword', reducer });

   const {
    onResetPassword,
    resetPasswordLoading,
    resetPasswordResponse,
    resetPasswordError,
    onCheckToken,
    checkTokenLoading,
    checkTokenError,
    checkTokenResponse,
    goToLoginPage,
   } = props;
  
  const token = qs.parse(location.search, { ignoreQueryPrefix: true }).token;

  const createNewPassword = values => {
    const accessToken = checkTokenResponse?.data?.token?.accessToken;
    if (accessToken) {
      onResetPassword(accessToken, { token, newt_pass: values.password, confirmed_pass: values.confirmPassword });
    }
  };

  useEffect(() => {
    if (resetPasswordResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.resetPasswordSuccess} />);
      goToLoginPage();
    }
    return () => {};
  }, [resetPasswordResponse]);

  useEffect(() => {
    if (resetPasswordError) {
      openNotification('error', resetPasswordError.message?.title, resetPasswordError.message?.content);
    }
    return () => {};
  }, [resetPasswordError]);

  useEffect(() => {
    if (checkTokenError) {
      openNotification('error', checkTokenError.message);
    }
    return () => {};
  }, [checkTokenError]);

  useEffect(() => {
    onCheckToken({ token });
    return () => {};
  }, []);


  return (
    <div>
      <div className="h100">
      <Helmet>
        <title>Reset Password</title>
        <meta name="description" content="Description of LoginPage" />
      </Helmet>
      <RegisterLayout loading={checkTokenLoading}>
        <div className="reset-password-layout h100">
          {checkTokenResponse?.success? (
            <>
              <Row>
                <Col span={8} offset={8}>
                  <CreatePasswordForm
                    title={<FormattedMessage {...messages.resetYourPassword} />}
                    onClickCreatePassword={createNewPassword}
                    showRequirements={false}
                    submitButtonName={<FormattedMessage {...globalMessages.resetPassword} />}
                  />
                </Col>
                {/* <div className="footer">
                  <RegisterFooter />
                </div> */}
              </Row>
            </>
          ) : (
            <div className="notification-layout centered-layout">
              <div className="notification-text color-primary bold-text">
                <div className="title">
                  <FormattedMessage {...messages.notification} />
                </div>
              </div>
              <div className="resend-button-layout mt-24">
                <Link to="/forgot-password">
                  <Button
                    type="primary"
                    className="mr-10 w-150"
                  >
                    <FormattedMessage {...globalMessages.retry} />
                  </Button>
                </Link>
                <Link to="/">
                  <Button type="primary" className="w-150">
                   <FormattedMessage {...globalMessages.homePage} />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </RegisterLayout>
    </div>
     
    </div>
  );
}

ResetPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  resetPassword: makeSelectResetPassword(),
   resetPasswordLoading: makeSelectResetPasswordLoading(),
  resetPasswordError: makeSelectResetPasswordError(),
  resetPasswordResponse: makeSelectResetPasswordResponse(),
  checkTokenLoading: makeSelectCheckTokenLoading(),
  checkTokenError: makeSelectCheckTokenError(),
  checkTokenResponse: makeSelectCheckTokenResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCheckToken: data => dispatch(checkTokenExist(data)),
    onResetPassword: (accessToken, data) => dispatch(resetPassword(accessToken, data)),
    goToLoginPage: () => dispatch(push('/admin/login')),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ResetPassword);
