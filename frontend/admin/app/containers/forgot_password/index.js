/**
 *
 * FogotPassword
 *
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectFogotPassword,
  makeSelectForgotPasswordError,
  makeSelectForgotPasswordLoading,
  makeSelectForgotPasswordResponse,
} from './selectors';
import sendEmailAction from './actions';
import reducer from './reducer';
import messages from './messages';
import { push } from 'connected-react-router';
import LoginLayout from 'components/layout/LoginLayout';
import { Row, Col, Button, Form, Input } from 'antd';
import globalMessages from 'messages';
import Footer from 'components/layout/Footer';
import RegisterLayout from 'components/layout/RegisterLayout';
import ButtonBack from 'components/ButtonBack';
import RegisterFooter from 'components/layout/RegisterFooter';
import { openNotification } from 'utils/notification';


import './styles.less'
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};
export function ForgotPassword(props) {
  const {
    history,
    sendEmail,
    forgotPasswordLoading,
    forgotPasswordError,
    forgotPasswordResponse,
    goToLogin,
  } = props;

  
  const onResetPassword = values => {
    const { email } = values;
    if (email) {
      sendEmail({ email });
    }
  };

   useEffect(() => {
     if (forgotPasswordResponse?.success) {
        openNotification('success', <FormattedMessage {...messages.successNotification} />);
        goToLogin();
    }
    return () => {};
   }, [forgotPasswordResponse]);
  
   useEffect(() => {
    if (forgotPasswordError) {
      openNotification('error', <FormattedMessage {...messages.failNotification} />);

    }
    return () => {};
  }, [forgotPasswordError]);

  useInjectReducer({ key: 'forgotPassword', reducer });
  
 
  return (
    <div className='h100'>
      <Helmet>
        <title>FogotPassword</title>
        <meta name="description" content="Description of FogotPassword" />
      </Helmet>
      <RegisterLayout>
        <div className="layout h100">
          <div className="button-back">
            <ButtonBack history={history} hasText={false} />
          </div>
          <Row>
            <Col span={10} offset={7}>
              <div className="title">
                <FormattedMessage {...messages.title} />
              </div>
              <div className="description">
                <FormattedMessage {...messages.content} />
              </div>
              <Form
                {...layout}
                name="basic"
                className="forgot-password-form"
                onFinish={onResetPassword}
              >
                <Form.Item
                  labelCol={{ span: 24 }}
                  label={<FormattedMessage {...messages.emailAddress} />}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage {...messages.emailRequired} />,
                    },
                    {
                      type: 'email',
                      message: <FormattedMessage {...messages.emailInvalid} />,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item className="submit-layout mt-24">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button-submit"
                    loading={forgotPasswordLoading}
                  >
                    <FormattedMessage {...globalMessages.resetPassword} />
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <div className="footer">
              <RegisterFooter />
            </div>
          </Row>
        </div>
      </RegisterLayout>

     
    </div>
  );
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  forgotPassword: makeSelectFogotPassword(),
  forgotPasswordError: makeSelectForgotPasswordError(),
  forgotPasswordLoading: makeSelectForgotPasswordLoading(),
  forgotPasswordResponse: makeSelectForgotPasswordResponse(),
  
  // loading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    sendEmail: email => dispatch(sendEmailAction(email)),
    goToLogin: () => dispatch(push('/admin/login')),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ForgotPassword);
