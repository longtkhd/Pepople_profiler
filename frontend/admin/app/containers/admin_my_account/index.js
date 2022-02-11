/**
 *
 * AdminMyAccount
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectChangePasswordSuccess,
  makeSelectChangePasswordError,
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ResetPasswordForm from 'components/ResetPasswordForm'
import Title from 'components/atoms/Title'
import FormInfoDetail from 'components/FormInfoDetail'
import './styles.less'
import { Row, Col } from 'antd'
import InputCustom from 'components/InputCustom';
import Button from 'components/atoms/Button'
import ProgressBarCheck from 'components/ProgressBarCheck'
import * as Yup from 'yup';
import changePasswordefault from './actions';
import { openNotification } from 'utils/notification';


export function AdminMyAccount(props) {
  const {
    onResetPassword,
    changePasswordSuccess,
    changePasswordError,
  } = props;
  useInjectReducer({ key: 'adminMyAccount', reducer });

  const [password, setPassword] = useState(0);
  const [confirmPass, setConfirmPass] = useState(0);

    useEffect(() => {
    if (changePasswordSuccess) {
      openNotification('success', 'Change Password Success! ')
    }
    }, [changePasswordSuccess])
  
  useEffect(() => {
    if (changePasswordError) {
      openNotification('error', 'Change Password Error! ')
    }
    }, [changePasswordError])
  
  

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
          setPassword(values.password.length * 100 / 20);
        }
      } else {
        setPassword(40)
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
          setConfirmPass(values.confirmPassword.length * 100 / 20);
        }
      } else {
        // setPassword(null);
        setConfirmPass(40)

      }
    }
  }

  const handleSubmit = (values) => {
    onResetPassword({
      old_pass: values.oldPassword,
      newt_pass: values.password,
    });
    setPassword(0);
    setConfirmPass(0);
  }

  const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required('Required!'),
    password: Yup.string()
      .max(50, 'Too Long!')
      .min(8, 'Password must be more than 8 characters!')
      .matches(/[a-z]/, 'At least one lowercase char')
      .matches(/[A-Z]/, 'At least one uppercase char')
      .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'At least 1 number or special char (@,!,#, etc).')
      .required('Required!')
      .notOneOf([Yup.ref("oldPassword")], "New password must be different from the old one. Please choose another password!"),
    confirmPassword: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required')
      .oneOf([Yup.ref("password")], "The two passwords that you entered do not match!"),
  });

  return (
    <div>
      <Helmet>
        <title>AdminMyAccount</title>
        <meta name="description" content="Description of AdminMyAccount" />
      </Helmet>
      <MainLayout mainLayoutStyles={{ backgroundColor: '#ffffff', marginTop: '10px !important' }}>
        <div className="profiler-admin-account">
          <div className="account-title">
            <Title>My Account</Title>
          </div>

          <FormInfoDetail
            // title={'Reset password'}
            case='use-form'
            enableReinitialize
            initialValues={{
              oldPassword: '',
              password: '',
              confirmPassword: '',
            }}
            validate={validate}
            validationSchema={passwordSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm({ values: '' });
            }}
          >
            <Row
              justify='center'
              align='middle'
              gutter={[
                { xs: 8, sm: 16, md: 24, lg: 32 },
                { xs: 8, sm: 16, md: 24, lg: 32 },

              ]}
              style={{ padding: '5px 0px' }}
            >
              <Col xs={24} sm={12} md={12} lg={4}>
                <div className="sub-title-password">
                  <Title>Reset Password</Title>

                </div>
              </Col>
            </Row>

            <Row
              justify='center'
              align='middle'
              gutter={[
                { xs: 8, sm: 16, md: 24, lg: 32 },
                { xs: 8, sm: 16, md: 24, lg: 24 },
              ]}
              style={{ padding: '5px 0' }}

            >
              <Col xs={24} sm={12} md={12} lg={6}>
                <InputCustom
                  starIcon={true}
                  styleformgroup={`mb- 20`}
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                />

              </Col>
            </Row>

            <Row
              justify='center'
              align='middle'
              gutter={[
                { xs: 8, sm: 16, md: 24, lg: 32 },
                { xs: 8, sm: 16, md: 24, lg: 24 },

              ]}
              style={{ padding: '5px 0' }}
            >
              <Col xs={24} sm={12} md={12} lg={6}>
                <InputCustom
                  starIcon={true}
                  styleformgroup={`mb- 20`}
                  label="New Password"
                  name="password"
                  type="password"
                />
                <ProgressBarCheck quality={password} />

              </Col>
            </Row>

            <Row
              justify='center'
              align='middle'
              gutter={[
                { xs: 8, sm: 16, md: 24, lg: 32 },
                { xs: 8, sm: 16, md: 24, lg: 16 },
              ]}
              style={{ padding: '5px 0' }}
            >
              <Col xs={24} sm={12} md={12} lg={6}>
                <InputCustom
                  starIcon={true}
                  styleformgroup={`mb- 20`}
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
                <ProgressBarCheck quality={confirmPass} />

              </Col>
            </Row>
            <div className="button-save">
              <Button
                className='btn-primary-gradient w-180'
                type='submit'
              >
                Save
                </Button>
            </div>
          </FormInfoDetail>
        </div>

      </MainLayout>
    </div>
  );
}

AdminMyAccount.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // adminMyAccount: makeSelectAdminMyAccount(),
    changePasswordSuccess: makeSelectChangePasswordSuccess(),
    changePasswordError: makeSelectChangePasswordError(),


});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
        onResetPassword: data => dispatch(changePasswordefault(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AdminMyAccount);
