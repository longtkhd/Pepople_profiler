/**
 *
 * SetupAgencyPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import qs from 'qs';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectUser,
  makeSelectSetupToken,
  makeSelectLoading,
  makeSelectCheckTokenError,
} from './selectors';
import checkUserToken from './actions';
import reducer from './reducer';
import { Link } from 'react-router-dom';

import createPasswordAction from 'containers/common_provider/create_password_setup/actions';
import {
  makeSelectCreatePasswordError,
  makeSelectCreatePasswordResponse,
} from 'containers/common_provider/create_password_setup/selectors';
import updateAgencyInfo from 'containers/common_provider/update_agency_setup/actions';
import {
  makeSelectUpdateAgencyError,
  makeSelectUpdateAgencyResponse,
} from 'containers/common_provider/update_agency_setup/selectors';
import updateNotificationSetting from 'containers/common_provider/update_notification_setting_setup/actions';

import CreatePasswordForm from 'components/CreatePasswordForm';
import CompanyInfo from 'components/CompanyInfo';
import PaymentInfo from 'components/PaymentInfo';
import SubscriptionFormSetup from 'components/SubscriptionFormSetup';
import AgencySetupDone from 'components/AgencySetupDone';
import RegisterLayout from 'components/layout/RegisterLayout';
import HighlightText from 'components/atoms/HighlightText';
import ButtonBackSteps from 'components/atoms/ButtonBackSteps';
import { openNotification } from 'utils/notification';

import { Steps, Button, Modal } from 'antd';
const { Step } = Steps;

import CreatePasswordSuccessIcon from 'images/icons/group-24.png';
import CompanyIcon from 'images/icons/group-21.png';
import CompanySuccessIcon from 'images/icons/group-21-green.png';
import SubscriptionIcon from 'images/icons/fill-26.png';
import SubscriptionSuccessIcon from 'images/icons/fill-26-green.png';
import CreditCardIcon from 'images/icons/group-22.png';
import CreditCardSuccessIcon from 'images/icons/group-22-green.png';
import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'messages';
import { CONFIG } from 'constants/config';
import { ContentModal } from '../../components/modals/ContentModal';
export function SetupAgencyPage(props) {
  const {
    socket,
    location,
    checkToken,
    loading,
    checkTokenError,
    user,
    setupToken,
    onCreatePassword,
    createPasswordError,
    createPasswordResponse,
    onUpdateAgency,
    updateAgencyError,
    updateAgencyResponse,
    onUpdateNotificationSetting,
  } = props;
  useInjectReducer({ key: 'setupAgencyPage', reducer });

  const token = qs.parse(location.search, { ignoreQueryPrefix: true }).token;
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const stepRef = React.useRef();

  const next = () => {
    setCurrent(current + 1);
    handleScrollTop();
  };

  const prev = () => {
    handleScrollTop();
    setCurrent(current - 1);
  };

  const onDonePayment = () => {
    setDone(true);
  };

  const onClickCreatePassword = data => {
    const req = {
      token,
      newt_pass: data.password,
      confirmed_pass: data.confirmPassword,
    };
    onCreatePassword(accessToken, req);
  };

  const onSetupAgencyBrading = data => {
    const { logo, background, agencyInfo } = data;
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('background', background);
    agencyInfo.id = user.agency_id;
    formData.append('agencyInfo', JSON.stringify(agencyInfo));
    onUpdateAgency(accessToken, formData);
  };

  const onSubscribePlanDone = result => {
    if (result) {
      Modal.success({
        centered: true,
        title: false,
        icon: false,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.updateSubscriptionSuccess} />}
            isSuccess={true}
          />
        ),
        okText: 'Next',
        onOk() {
          next();
        },
      });
    }
  };

  const initNotificationSettings = () => {
    if (user?.role) {
      const defaultSettings = CONFIG.DEFAULT_AGENCY_NOTIFICATIONS_SETTINGS;
      onUpdateNotificationSetting(accessToken, defaultSettings);
    }
  };

  const CreatePasswordTitle = () => {
    return (
      <div className="text-center">
        <div>
          <FormattedMessage {...messages.emailVerified} />
        </div>
        <HighlightText>
          <FormattedMessage {...messages.pleaseCreatePassword} />
        </HighlightText>
      </div>
    );
  };

  const steps = [
    {
      title: <FormattedMessage {...messages.createPasswordStepTitle} />,
      icon: CreatePasswordSuccessIcon,
      content: (
        <CreatePasswordForm
          title={<CreatePasswordTitle />}
          showRequirements={true}
          onClickCreatePassword={onClickCreatePassword}
          submitButtonName={<FormattedMessage {...globalMessages.create} />}
        />
      ),
    },
    {
      title: <FormattedMessage {...messages.companyInfoStepTitle} />,
      icon: current >= 1 ? CompanySuccessIcon : CompanyIcon,
      content: (
        <CompanyInfo
          onSetupAgencyBrading={onSetupAgencyBrading}
          user={user}
          setupToken={setupToken}
        />
      ),
    },
    {
      title: <FormattedMessage {...messages.subscriptionInfoStepTitle} />,
      icon: current >= 2 ? SubscriptionSuccessIcon : SubscriptionIcon,
      content: (
        <SubscriptionFormSetup
          onSubscribePlanDone={onSubscribePlanDone}
          user={user}
          setupToken={setupToken}
          onBack={prev}
        />
      ),
    },
    {
      title: <FormattedMessage {...messages.paymentInfoStepTitle} />,
      icon: current == 3 ? CreditCardSuccessIcon : CreditCardIcon,
      content: (
        <PaymentInfo
          onDone={onDonePayment}
          onSkipPayment={onDonePayment}
          socket={socket}
          user={user}
          setupToken={setupToken}
          onBack={prev}
        />
      ),
    },
  ];

  const handleScrollTop = () => {
    window.scrollTo(0,0);
    if(stepRef.current) stepRef.current.scrollTo(0,0);
  }

  useEffect(() => {
    if (setupToken) {
      setAccessToken(setupToken.accessToken);
    }
    return () => {};
  }, [setupToken]);

  useEffect(() => {
    if (createPasswordResponse) {
      Modal.success({
        centered: true,
        title: false,
        icon: false,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.createPasswordSuccess} />}
            isSuccess={true}
          />
        ),
        okText: 'Next',
        onOk() {
          initNotificationSettings();
          next();
        },
      });
    }
    return () => {};
  }, [createPasswordResponse]);

  useEffect(() => {
    if (updateAgencyResponse) {
      Modal.success({
        centered: true,
        title: false,
        icon: false,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.updateAgencySuccess} />}
            isSuccess={true}
          />
        ),
        okText: 'Next',
        onOk() {
          next();
        },
      });
    }
    return () => {};
  }, [updateAgencyResponse]);

  useEffect(() => {
    if (updateAgencyError) {
      // openNotification('error', updateAgencyError.message);
      Modal.success({
        centered: true,
        title: false,
        icon: false,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={updateAgencyError.message}
            isSuccess={false}
          />
        ),
        okText: 'Ok',
      });
    }
    return () => {};
  }, [updateAgencyError]);

  useEffect(() => {
    if (createPasswordError) {
      // openNotification(
      //   'error',
      //   createPasswordError.message.title,
      //   createPasswordError.message.content,
      // );
      Modal.success({
        centered: true,
        title: false,
        icon: false,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={createPasswordError.message.title}
            message={createPasswordError.message.content}
            isSuccess={false}
          />
        ),
        okText: 'Ok',
      });
    }
    return () => {};
  }, [createPasswordError]);

  useEffect(() => {
    checkToken({ token });
    return () => {};
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="h100">
      <Helmet>
        <title>Setup Agency</title>
        <meta name="description" content="Description of SetupAgencyPage" />
      </Helmet>
      <RegisterLayout loading={loading}>
        {!checkTokenError ? (
          <div className="step-layout h100" ref={stepRef}>
            <div className="step-header">
              {/* {current > 1 && current < 4 && !done ? (
                <ButtonBackSteps onClick={prev} />
              ) : null} */}
              <Steps current={current} type="navigation">
                {steps.map((step, index) => {
                  const status =
                    current > index
                      ? 'finish'
                      : current == index
                      ? 'process'
                      : 'wait';
                  return (
                    <Step
                      key={step.title}
                      title={step.title}
                      icon={<img src={step.icon} />}
                      status={status}
                    />
                  );
                })}
              </Steps>
            </div>
            <div className="steps-content">
              {!done ? steps[current].content : <AgencySetupDone />}
            </div>
          </div>
        ) : (
          <div className="notification-layout centered-layout">
            <div className="notification-text color-primary bold-text">
              <FormattedMessage {...messages.tokenInvalid} />
            </div>
            <div className="resend-button-layout mt-24">
              <Link to="/">
                <Button type="primary" className="resend-button">
                  <FormattedMessage {...globalMessages.homePage} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </RegisterLayout>
    </div>
  );
}

SetupAgencyPage.propTypes = {
  loading: PropTypes.bool,
  checkToken: PropTypes.func,
  checkTokenError: PropTypes.object,
  user: PropTypes.object,
  setupToken: PropTypes.object,
  onCreatePassword: PropTypes.func,
  createPasswordError: PropTypes.object,
  createPasswordResponse: PropTypes.object,
  onUpdateAgency: PropTypes.func,
  updateAgencyError: PropTypes.object,
  updateAgencyResponse: PropTypes.object,
  onUpdateNotificationSetting: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  checkTokenError: makeSelectCheckTokenError(),
  user: makeSelectUser(),
  setupToken: makeSelectSetupToken(),
  createPasswordError: makeSelectCreatePasswordError(),
  createPasswordResponse: makeSelectCreatePasswordResponse(),
  updateAgencyError: makeSelectUpdateAgencyError(),
  updateAgencyResponse: makeSelectUpdateAgencyResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    checkToken: token => dispatch(checkUserToken(token)),
    onCreatePassword: (accessToken, data) =>
      dispatch(createPasswordAction(accessToken, data)),
    onUpdateAgency: (accessToken, data) =>
      dispatch(updateAgencyInfo(accessToken, data)),
    onUpdateNotificationSetting: (accessToken, data) =>
      dispatch(updateNotificationSetting(accessToken, data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SetupAgencyPage);
