import React, { memo, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import ButtonStep from './ButtonStep';
import FormFirstStep from './FormFirstStep';
import FormSecondStep from './FormSecondStep';
import Congratulation from 'components/Congratulation/loadable';

import { createStructuredSelector } from 'reselect';
import {
  makeSelectRecruiterInfo,
  makeSelectEditRecruiterInfo,
} from './selectors';
import { makeSelectCreatePasswordResponse } from 'containers/common_provider/create_password_setup/selectors';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { editPersonalDetail } from './actions';
import { CONFIG } from 'constants/config';

const JoinForm = ({
  editPersonal,
  recruiterInfo,
  editPersonalDetail,
  step,
  nextStepForm,
  userInfo,
  createNewPassword,
  tokenId,
  accessTok,
  onUpdateNotificationSetting,
  createPasswordResponse,
}) => {

  const renderStep = step => {
    switch (step) {
      case 1:
        return <FormFirstStep step={step} />;
      case 2:
        return <FormSecondStep step={step} onClickCreatePassword={onClickCreatePassword} />;
      case 3:
        return <Congratulation />;
      default:
        return <FormFirstStep />;
    }
  };

  const onClickCreatePassword = (values) => {
    const { password, confirmPassword } = values;
    const payload = {
      token: tokenId,
      newt_pass: password,
      confirmed_pass: confirmPassword,
    };
    const defaultNotiSettings = CONFIG.DEFAULT_RECRUITER_NOTIFICATIONS_SETTINGS;
    createNewPassword(recruiterInfo?.token?.accessToken, payload);
    onUpdateNotificationSetting(recruiterInfo?.token?.accessToken, defaultNotiSettings);
  }

  const nextStep = () => nextStepForm(step);
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validateStep = step => {
    let validation;
    if (step === 1) {
      validation = Yup.object().shape({
        firstName: Yup.string()
          .min(3, 'Must be 3 characters or long')
          .max(50, 'First name cannot exceed 50 char')
          .required('Please enter first name'),
        lastName: Yup.string()
          .min(3, 'Must be 3 characters or long')
          .max(50, 'Last name cannot exceed 50 char')
          .required('Please enter last name'),
        jobTitle: Yup.string()
          .max(200, 'The job name cannot exceed 200 char')
          .required('Please enter job title'),
        email: Yup.string()
          .email('Invalid email address'),
        phoneNumber: Yup.string()
          .matches(phoneRegExp, 'Phone number is not valid')
          .min(2, 'Too short')
          .required('Please enter phone number'),
      });
    } else if (step === 2) {
      validation = Yup.object().shape({
        password: Yup.string()
          .min(8, 'Password must greater than, equal to 8 char')
          .required('Please enter password'),
        confirmPassword: Yup.string()
          .required('Please confirm your password'),
      });
    }
    return {
      validation,
    };
  };

  const formData = {
    firstName: userInfo?.firstname || '',
    lastName: userInfo?.lastname || '',
    jobTitle: userInfo?.job_title || '',
    email: userInfo?.email || '',
    phoneNumber: userInfo?.phone || '',
    password: '',
    confirmPassword: '',
  };

  useEffect(() => {
    if (createPasswordResponse?.success) {
      nextStep();
    }
  }, [createPasswordResponse]);

  return (
    <div className={`step-form`}>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...formData }}
        validationSchema={validateStep(step).validation}
        onSubmit={(values, actions) => {
          const {
            password,
            confirmPassword,
            firstName,
            lastName,
            email,
            jobTitle,
            phoneNumber,
          } = values;
          const payload = {
            first_name: firstName,
            last_name: lastName,
            email,
            job_title: jobTitle,
            phone_number: phoneNumber,
          };
          editPersonalDetail(payload, {
            headers: {
              Authorization: `Bearer ${recruiterInfo?.token?.accessToken}`,
            },
          });
          nextStep();
          if (step === 2) {
            actions.setSubmitting(true);
          }
        }}
      >
        <Form className="form">
          {renderStep(step)}
          {step !== 2 && <ButtonStep step={step} />}
        </Form>
      </Formik>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  recruiterInfo: makeSelectRecruiterInfo(),
  editPersonal: makeSelectEditRecruiterInfo(),
  createPasswordResponse: makeSelectCreatePasswordResponse(),
});

const mapDispatchToProps = {
  editPersonalDetail,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(JoinForm);
