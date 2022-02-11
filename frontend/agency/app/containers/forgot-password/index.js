import React, { memo, useEffect,useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import globalMessages from 'messages';
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import sendEmailAction from './actions';
import {
  makeSelectForgotPasswordError,
  makeSelectForgotPasswordLoading,
  makeSelectForgotPasswordResponse,
} from './selector';

import { openNotification } from 'utils/notification';
import { Row, Col, Button, Form, Input } from 'antd';
import RegisterLayout from 'components/layout/RegisterLayout';
import ButtonBack from 'components/ButtonBack';
import RegisterFooter from 'components/layout/RegisterFooter';
import './style.less';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};

const ForgotPassword = props => {
  useInjectReducer({ key: 'forgotPassword', reducer });
  const [toggleModal, setToggleModal] = useState(false);

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
  const onCancel = () => {
    setToggleModal(false);
    // reset()
  };

  useEffect(() => {
    if (forgotPasswordResponse?.success) {
      openNotification(
        'success',
        <FormattedMessage {...messages.successNotification} />,
      );
      goToLogin();
    }
    return () => {};
  }, [forgotPasswordResponse]);

  useEffect(() => {
    if (forgotPasswordError) {
      setToggleModal(true)
    }
    return () => {};
  }, [forgotPasswordError]);

  return (
    <>
    <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        title={`Hmm, we can't find your email address`}
        content={`Please double check your email and try again`}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                onClick={onCancel}
                className={`btn-default-outline w-120`}
              >
                {`OK`}
              </ButtonCustom>
            </Col>
           
          </Row>,
        ]}
      />
    <div className="h100">
      <Helmet>
        <title>Forgot Password</title>
        <meta
          name="description"
          content="Description of forgot password page"
        />
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
    </>
  );
};

ForgotPassword.propTypes = {
  sendEmail: PropTypes.func,
  forgotPasswordError: PropTypes.object,
  forgotPasswordLoading: PropTypes.bool,
  forgotPasswordResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  forgotPasswordError: makeSelectForgotPasswordError(),
  forgotPasswordLoading: makeSelectForgotPasswordLoading(),
  forgotPasswordResponse: makeSelectForgotPasswordResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    sendEmail: email => dispatch(sendEmailAction(email)),
    goToLogin: () => dispatch(push('/login')),
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
