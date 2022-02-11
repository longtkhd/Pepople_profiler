/**
 *
 * MyAccount
 *
 */

import React, { memo, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import messages from './messages';
import globalMessages from 'messages';

import { makeSelectUserInfo } from 'containers/common_provider/get_user_info/selectors';
import { makeSelectAgencyInfo } from 'containers/common_provider/get_agency_info/selectors';
import {
  makeSelectChangePasswordSuccess,
  makeSelectChangePasswordError,
} from 'containers/common_provider/change_password/selectors';
import { resetState } from 'containers/common_provider/change_password/actions';
import {
  makeSelectUpdateUserSuccess,
  makeSelectUpdateUserError,
} from 'containers/common_provider/update_user_profile/selectors';
import {
  makeSelectRequestChangeMailSuccess,
  makeSelectRequestChangeMailError,
} from 'containers/common_provider/request_change_mail/selectors';
import requestChangeDefault from 'containers/common_provider/request_change_mail/actions';
import getUserDefault from 'containers/common_provider/get_user_info/actions';
import updateProfileDefault from 'containers/common_provider/update_user_profile/actions';
import resetPasswordDefault from 'containers/common_provider/change_password/actions';
import getAgencyInfoAction from 'containers/common_provider/get_agency_info/actions';

import { Row, Col, Modal } from 'antd';
import { InputOldCustom } from 'components/InputCustom';
import Button from 'components/atoms/Button';
import { LockOutlined } from '@ant-design/icons';
import MainLayout from 'components/layout/MainLayout';
import CombinedCustom from 'components/CombinedCustom';
import FormInfoDetail from 'components/FormInfoDetail';
import ProgressBarCheck from 'components/ProgressBarCheck';
import { openNotification } from 'utils/notification';
import ModalCustom from 'components/ModalCustom';
import HeadingMedium from 'components/HeadingMedium';
import CloseButton from 'components/CloseButton';
import DowngradeNotiIcon from 'images/icons/combined-shape.png';

import * as Yup from 'yup';
import './styles.less';

import { getUserInfo, cacheCurrentUserInfo } from 'services/authentication';
import { CONFIG } from 'constants/config';
import { ContentModal } from '../../components/modals/ContentModal'
const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;
export function MyAccount(props) {
  const userInfo = getUserInfo();

  useInjectReducer({ key: ' myAccount', reducer });

  const {
    socket,
    onGetUser,
    getUserInfos,
    onUpdateProfile,
    onResetPassword,
    updateUserError,
    updateUserSucces,
    changePasswordSuccess,
    changePasswordError,
    getAgencyInfo,
    agencyInfo,
    onChangeMail,
    changeEmailSuccess,
    mailError,
    resetStateRequest,
  } = props;
  const [password, setPassword] = useState(0);
  const [confirmPass, setConfirmPass] = useState(0);
  const [userDatas, setUserDatas] = useState(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleModalUpdate, setToggleModalUpdate] = useState(false);
  const [oldEmail, setOldEmail] = useState('');

  const initialUser = {
    first_name: '',
    last_name: '',
    job_title: '',
    email: '',
    phone_number: '',
  };

  const initialRequestEmail = {
    newEmail: '',
  };

  const showModal = () => {
    setToggleModal(true);
  };

  const handleCancel = e => {
    setToggleModal(false);
  };

  const handleSubmitUpdate = values => {
    onUpdateProfile({
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      job_title: values.job_title,
      agency_name: values.agency_id,
      country_code: values.country_code,
    });
    cacheCurrentUserInfo({
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone_number,
      job_title: values.job_title,
      agency_name: values.agency_id,
      country_code: values.country_code,
    });
    const oldFirstName = userDatas?.first_name;
    const oldLastName = userDatas?.last_name;

    if (
      userInfo.role == 'recruiter' &&
      (oldFirstName != values.first_name || oldLastName != values.last_name)
    ) {
      socket.emit('clientSendNotification', {
        sender_id: userInfo.id,
        receiver_id: agencyInfo.owner_id,
        type: NOTIFICATION_TYPES.RECRUITER_CHANGE_NAME,
        title: 'Recruiter name changed',
        content: `<div><span class="notification-content-highlight">${
          userDatas.first_name
        } ${
          userDatas.last_name
        }</span> has changed their name to <span class="notification-content-highlight">${
          values.first_name
        } ${values.last_name}</span></div>`,
      });
    }
  };

  const handleOk = values => {
    onChangeMail(userInfo?.id, values);
    setOldEmail(values?.newEmail);
    setToggleModal(false);
  };

  useEffect(() => {
    if (changeEmailSuccess) {
      // openNotification('success', <FormattedMessage {...messages.requestChangeMailSuccess} />);
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.requestSuccess} />}
            message={<FormattedMessage {...messages.requestContent} />}
            isSuccess={true}
          />
        ),
        okText: <FormattedMessage {...messages.done} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
      });
      socket.emit('clientSendNotification', {
        sender_id: userInfo.id,
        receiver_id: agencyInfo.owner_id,
        type: NOTIFICATION_TYPES.RECRUITER_REQUEST_TO_UPDATE_EMAIL,
        title: 'Request to update the email address',
        content: `<div><span class="notification-content-highlight">${
          userInfo.firstname
        } ${
          userInfo.lastname
        }</span> requests to change their email address from <span class="notification-content-highlight">${
          userInfo.email
        }</span> to <span class="notification-content-highlight">${oldEmail}</span></div>`,
      });
    }
    return () => {};
  }, [changeEmailSuccess]);

  const Content = ({ title, message }) => {
    return (
      <div className="invite-confirm-content">
        <img src={DowngradeNotiIcon} alt="downgrade-notification" />
        <p className="title">{title}</p>
        <p className="description">{message}</p>
      </div>
    );
  };

  useEffect(() => {
    if (mailError?.error?.message == 'EMAIL_ALREADY_EXIST') {
      openNotification(
        'error',
        <FormattedMessage {...messages.emailAlreadyExist} />,
      );
    } else if (
      mailError?.error?.message !== 'EMAIL_ALREADY_EXIST' &&
      mailError !== null
    ) {
      openNotification(
        'error',
        <FormattedMessage {...messages.someThingsWrong} />,
      );
    } else {
      return () => {};
    }
    resetStateRequest();
  }, [mailError]);

  const handleSubmitReset = values => {
    onResetPassword({
      old_pass: values.oldPassword,
      newt_pass: values.password,
    });
    setPassword(0);
    setConfirmPass(0);
  };

  const validate = values => {
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z_@./#&+-]{8,}$/;

    if (!values.password) {
      setPassword(null);
      return Promise.resolve();
    } else {
      if (passwordRegex.test(values.password)) {
        if (values.password.length >= 20) {
          setPassword(100);
        } else {
          setPassword((values.password.length * 100) / 20);
        }
      } else {
        setPassword(40);
      }
    }

    if (!values.confirmPassword) {
      setConfirmPass(null);
      return Promise.resolve();
    } else {
      if (passwordRegex.test(values.confirmPassword)) {
        if (values.confirmPassword.length >= 20) {
          setConfirmPass(100);
        } else {
          setConfirmPass((values.confirmPassword.length * 100) / 20);
        }
      } else {
        // setPassword(null);
        setConfirmPass(40);
      }
    }
  };

  const schema = Yup.object().shape({
    newEmail: Yup.string()
      .required('Please enter Email')
      // .trim('Please remove whitespace')
      // .strict(true)
      .email('Email is not valid'),
  });

  const SignupSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Required!'),
    password: Yup.string()
      .required('Required!')
      .min(8, 'Password must be more than 8 characters!')
      .matches(/[a-z]/, 'At least one lowercase char')
      .matches(/[A-Z]/, 'At least one uppercase char')
      .matches(
        /[a-zA-Z]+[^a-zA-Z\s]+/,
        'At least 1 number or special char (@,!,#, etc).',
      ),
    confirmPassword: Yup.string()
      .required('Required!')
      .oneOf(
        [Yup.ref('password')],
        'The two passwords that you entered do not match!',
      ),
  });

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const InfoSchema = Yup.object().shape({
    first_name: Yup.string().required('Required!'),
    last_name: Yup.string().required('Required!'),
    job_title: Yup.string().required('Required!'),
    phone_number: Yup.string()
      .max(10, 'Phone number max is 10 number')
      // .trim('Please remove whitespace')
      // .strict(true)
      .matches(phoneRegExp, 'Phone Number is not valid')
      .required('Please enter Phone Number'),
  });

  useEffect(() => {
    if (getUserInfos) {
      setUserDatas(getUserInfos);
    }
    return () => {};
  }, [getUserInfos]);

  useEffect(() => {
    if (changePasswordSuccess) {
      // openNotification(
      //   'success',
      //   <FormattedMessage {...messages.resetPasswordSuccess} />,
      // );
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.done} />}
            message={<FormattedMessage {...messages.resetPasswordSuccess} />}
            isSuccess={true}
          />
        ),
        okText: <FormattedMessage {...messages.done} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
      });
    }
    return () => {};
  }, [changePasswordSuccess]);

  useEffect(() => {
    if (changePasswordError?.success == false) {
      setToggleModalUpdate(true);
    }
    resetStateRequest();
  }, [changePasswordError]);

  useEffect(() => {
    if (updateUserSucces) {
      // openNotification('success', <FormattedMessage {...messages.updatePersonalDetailsSuccess} />)
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'nem-modal-confirm',
        content: (
          <ContentModal
            title={<FormattedMessage {...messages.done} />}
            message={
              <FormattedMessage {...messages.updatePersonalDetailsSuccess} />
            }
            isSuccess={true}
          />
        ),
        okText: <FormattedMessage {...messages.done} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
      });
    }
    return () => {};
  }, [updateUserSucces]);

  useEffect(() => {
    if (updateUserError) {
      // openNotification(
      //   'error',
      //   <FormattedMessage {...updateUserError.message} />,
      // );
      Modal.confirm({
        title: false,
        icon: false,
        centered: true,
        className: 'contact-modal-confirm',
        content: (
          <Content
            title={<FormattedMessage {...messages.failed} />}
            message={
              <FormattedMessage {...messages.updatePersonalDetailsFailed} />
            }
          />
        ),
        okText: <FormattedMessage {...messages.done} />,
        // cancelText: <FormattedMessage {...messages.requestChange} />,
        cancelButtonProps: { className: 'modal-btn-cancel d-none' },
        okButtonProps: { className: 'modal-btn-ok' },
      });
    }
    return () => {};
  }, [updateUserError]);

  useEffect(() => {
    onGetUser();
    getAgencyInfo(userInfo?.agency_id);
    return () => {};
  }, []);

  return (
    <div>
      <CombinedCustom
        width={500}
        toggleModal={toggleModalUpdate}
        title={`Password Incorrect`}
        content={`Please check your current password and try again. `}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <Button
                type="primary"
                className="btn-primary-gradient"
                onClick={() => {
                  setToggleModalUpdate(false);
                }}
              >
                {`OK`}
              </Button>
            </Col>
          </Row>,
        ]}
      />
      <Helmet>
        <title>My Account</title>
        <meta name="description" content="Description of MyAccount" />
      </Helmet>
      <MainLayout>
        <div className={'my-account-page'}>
          <FormInfoDetail
            title={<FormattedMessage {...messages.updatePersonal} />}
            actions={
              <Row className="action-group" gutter={[8, 0]}>
                <Col>
                  <Button className="btn-default-outline " type="submit">
                    <FormattedMessage {...messages.update} />
                  </Button>
                </Col>
              </Row>
            }
            case="use-form"
            initialValues={userDatas || initialUser}
            enableReinitialize
            onSubmit={values => {
              handleSubmitUpdate(values);
            }}
            validationSchema={InfoSchema}
          >
            <Row
              justify="start"
              align="left"
              gutter={[
                { xs: 8, sm: 16, md: 24, lg: 32 },
                { xs: 8, sm: 16, md: 24, lg: 32 },
              ]}
            >
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb- 20`}
                  label="First Name"
                  name="first_name"
                  type="text"
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb-20`}
                  label="Last Name"
                  name="last_name"
                  type="text"
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb-20`}
                  label="Job Title"
                  name="job_title"
                  type="text"
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={7}>
                <div className="request-change-email">
                  <InputOldCustom
                    starIcon={true}
                    styleformgroup={`mb-20`}
                    label="Email"
                    name="email"
                    type="email"
                    disabled
                  />
                  {userInfo?.role == 'recruiter' ? (
                    <ModalCustom
                      className="custom-modal-request"
                      style={{ borderRarius: '15px' }}
                      type="RequestModal"
                      closable={true}
                      closeIcon={<CloseButton />}
                      title={
                        <HeadingMedium>
                          <FormattedMessage
                            {...messages.requestChangeEmailTitle}
                          />
                        </HeadingMedium>
                      }
                      showModal={showModal}
                      toggleModal={toggleModal}
                      handleCancel={handleCancel}
                      footer={[
                        <>
                          <Row gutter={[8, 0]} justify="center">
                            <Col />
                          </Row>
                        </>,
                      ]}
                      btnName={
                        <>
                          <Button className="btn-default-outline" type="button">
                            <FormattedMessage {...messages.requestChange} />
                          </Button>
                        </>
                      }
                    >
                      <FormInfoDetail
                        case="use-form"
                        initialValues={initialRequestEmail}
                        enableReinitialize
                        onSubmit={(values, { resetForm }) => {
                          handleOk(values);
                          resetForm({ values: '' });
                        }}
                        validationSchema={schema}
                      >
                        <p>
                          <FormattedMessage
                            {...messages.requestChangeEmailContent}
                          />
                        </p>
                        <Row>
                          <Col xs={24} md={24} lg={24} xl={24}>
                            <InputOldCustom
                              styleformgroup={`mb-20`}
                              label="Email"
                              name="newEmail"
                              type="text"
                            />
                          </Col>
                        </Row>
                        <Button
                          className="btn-primary-gradient button-submit-inside"
                          type="submit"
                        >
                          <FormattedMessage {...globalMessages.submit} />
                        </Button>
                      </FormInfoDetail>
                    </ModalCustom>
                  ) : null}
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb-20`}
                  label="Phone Number"
                  name="phone_number"
                  type="text"
                />
              </Col>
            </Row>
          </FormInfoDetail>
          <FormInfoDetail
            title={<FormattedMessage {...messages.resetPasssword} />}
            actions={
              <Row className="action-group" gutter={[8, 0]}>
                <Col>
                  <Button className="btn-default-outline ">
                    <FormattedMessage {...messages.update} />
                  </Button>
                </Col>
              </Row>
            }
            case="use-form"
            initialValues={{
              oldPassword: '',
              password: '',
              confirmPassword: '',
            }}
            validate={validate}
            validationSchema={SignupSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmitReset(values);
              resetForm({ values: '' });
            }}
          >
            <Row
              justify="start"
              align="left"
              gutter={[
                { xs: 8, sm: 16, md: 24, lg: 32 },
                { xs: 8, sm: 16, md: 24, lg: 32 },
              ]}
            >
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb-20`}
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb-20`}
                  label="Password"
                  name="password"
                  type="password"
                />
                <ProgressBarCheck quality={password} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={4}>
                <InputOldCustom
                  starIcon={true}
                  styleformgroup={`mb-20`}
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
                <ProgressBarCheck quality={confirmPass} />
              </Col>
            </Row>
          </FormInfoDetail>
          {userInfo?.role == 'agency' ? (
            <div className={'deactive-button'}>
              <Row justify="center" align="middle">
                <Col>
                  <Button className="btn-secondary ">
                    <LockOutlined className="icon-btn" />
                    <FormattedMessage {...messages.deActiveAccount} />
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}
        </div>
      </MainLayout>
    </div>
  );
}

MyAccount.propTypes = {
  getAgencyInfo: PropTypes.func,
  agencyInfo: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  updateUserSucces: makeSelectUpdateUserSuccess(),
  updateUserError: makeSelectUpdateUserError(),
  getUserInfos: makeSelectUserInfo(),
  changePasswordError: makeSelectChangePasswordError(),
  changePasswordSuccess: makeSelectChangePasswordSuccess(),
  agencyInfo: makeSelectAgencyInfo(),
  changeEmailSuccess: makeSelectRequestChangeMailSuccess(),
  mailError: makeSelectRequestChangeMailError(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetUser: () => dispatch(getUserDefault()),
    onUpdateProfile: data => dispatch(updateProfileDefault(data)),
    onResetPassword: data => dispatch(resetPasswordDefault(data)),
    getAgencyInfo: agencyId => dispatch(getAgencyInfoAction(agencyId)),
    onChangeMail: (id, email) => dispatch(requestChangeDefault(id, email)),
    resetStateRequest: () => dispatch(resetState()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(MyAccount);
