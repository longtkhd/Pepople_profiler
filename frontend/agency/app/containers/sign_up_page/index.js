/**
 *
 * SignUpPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectShowVerify,
  makeSelectAgency,
} from './selectors';
import reducer from './reducer';
import registerAgency, { resetSignUpPage } from './actions';
import resendVerifyAction from 'containers/common_provider/resend_verify/actions';
import {
  makeSelectResendVerifyLoading,
  makeSelectResendVerifyError,
  makeSelectResendVerifyResponse,
} from 'containers/common_provider/resend_verify/selectors';

import { Button,Row, Col } from 'antd';
import { Link } from 'react-router-dom'
import RegisterLayout from 'components/layout/RegisterLayout';
import RegisterFooter from 'components/layout/RegisterFooter';
import ButtonBack from 'components/ButtonBack';
import SignupForm from 'components/SignupForm';
import { openNotification } from 'utils/notification';
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import './styles.less';
import EmailLogo from 'images/icons/mail.png';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';

export function SignUpPage(props) {
  const { 
    history,
    onRegisterAgency, 
    showVerify, 
    onResendVerify, 
    loading, 
    error, 
    agency, 
    resendVerifyLoading, 
    resendVerifyError, 
    resendVerifyResponse,
    reset
  } = props;
  useInjectReducer({ key: 'signUpPage', reducer });
  
  const [resendTime, setResendTime] = useState(60);
  const [userEmail, setUserEmail] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  let interval;

  const onSubmit = (data) => {
    // TODO: actions to save agency data
    const { email } = data;
    setUserEmail(email);
    onRegisterAgency(data);
  }

  const onCancel = () => {
    setToggleModal(false);
    reset()
  };

  const onClickResendVerify = () => {
    if (userEmail) {
      const data = { email: userEmail };
      onResendVerify(data);
      setResendTime(60);
    }
  }

  
  useEffect(() => {
    if (agency) {
      setResendTime(60);
    }
    return () => {
      setResendTime(0);
    }
  }, [agency])

  useEffect(() => {
    if (resendVerifyError) {
      openNotification('error', resendVerifyError.message);
    }
    return () => { }
  }, [resendVerifyError])

  useEffect(() => {
    if (error !== null) {
      setToggleModal(true)
    }
    return () => {}
  }, [error])

  useEffect(() => {
    if (resendVerifyResponse) {
      openNotification('info', <FormattedMessage  {...messages.resendVerifySuccess} />);
    }
    return () => { }
  }, [resendVerifyResponse])

  useEffect(() => {
    if (resendTime > 0) {
      interval = setInterval(() => {
        setResendTime(resendTime - 1)
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [resendTime])

  return (
    <>
    <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        title={`This email already exists in our system!`}
        content={`Please login or use another email address.`}
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
        <title>Sign Up</title>
        <meta name="description" content="Description of Sign Up Page" />
      </Helmet>
      <RegisterLayout>
        <div className="layout h100">
          {!showVerify ? (
            <>
              <div className="title">
                <div className="title-first-row">
                  <ButtonBack history={history} hasText={false} />
                  <FormattedMessage  {...messages.tryPeopleProfiler} />
                </div>
                <div className="color-primary">
                  <FormattedMessage  {...messages.freeFor} />
                </div>
              </div>
              <div className="description">
                <div className="description-line1">
                  <FormattedMessage  {...messages.trialPeopleProfiler} />
                </div>
                <div className="description-line-2">
                  <FormattedMessage  {...messages.joining} /> 
                  <span className="color-primary">
                    <FormattedMessage  {...messages.fourSteps} />  
                  </span>
                  <FormattedMessage  {...messages.letsGo} />
                </div>
              </div>
              <div className="sign-up-form">
                <SignupForm onSubmit={onSubmit}/>
              </div>
            </>
          ) : (
            <>
              <div className="email-logo">
                <img src={EmailLogo} />
              </div>
              <div className="email-title color-primary">
                <FormattedMessage  {...messages.verificationSent} />
              </div>
              <div className="email-description">
                <div className="email-description-line-1">
                  <FormattedMessage  {...messages.linkClick} />
                </div>
                <div className="email-description-line-2">
                  <FormattedMessage  {...messages.checkSpam} />
                </div>
              </div>
              <div className="verify-email-actions">
                <Button 
                  type={resendTime > 0 ? "default" : "primary"} 
                  disabled={resendTime > 0}
                  onClick={onClickResendVerify}
                >
                  <div>
                    {
                      resendTime > 0 ? (
                        <span><FormattedMessage  {...messages.resendIn} /><span className="color-primary">{resendTime}s</span></span>
                      ) : <FormattedMessage  {...globalMessages.resend} />
                    }
                  </div>
                </Button>
                <Link to='/'>
                  <Button type="primary">
                    <FormattedMessage  {...globalMessages.homePage} />
                  </Button>
                </Link>
              </div>
            </>
          )}
          <div className="footer">
            <RegisterFooter />
          </div>
        </div>
      </RegisterLayout>
    </div>
    </>
  );
}

SignUpPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  onRegisterAgency: PropTypes.func,
  onResendVerify: PropTypes.func,
  showVerify: PropTypes.bool,
  agency: PropTypes.object,
  resendVerifyLoading: PropTypes.bool,
  resendVerifyError: PropTypes.object,
  resendVerifyResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  agency: makeSelectAgency(),
  showVerify: makeSelectShowVerify(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  resendVerifyLoading: makeSelectResendVerifyLoading(),
  resendVerifyError: makeSelectResendVerifyError(),
  resendVerifyResponse: makeSelectResendVerifyResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    onRegisterAgency: data => dispatch(registerAgency(data)),
    onResendVerify: data => dispatch(resendVerifyAction(data)),
    reset: () => dispatch(resetSignUpPage())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SignUpPage);
