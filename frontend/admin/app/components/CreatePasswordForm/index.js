/**
 *
 * CreatePasswordForm
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Progress } from 'antd';
import Title from 'components/atoms/Title';
import './styles.less';

import { inRange } from 'lodash';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

const layout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 24 },
};

function CreatePasswordForm(props) {
  const { title, showRequirements, onClickCreatePassword } = props;

  const [passwordQuality, setPasswordQuality] = useState(null);

  const onFinish = values => {
    onClickCreatePassword(values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const formatCheckPassword = (percent, successPercent) => {
    if (inRange(percent, 0, 50)) {
      return 'Weak';
    } else if (inRange(percent, 50, 80)) {
      return 'Average';
    } else if (inRange(percent, 80, 100)) {
      return 'Strong';
    } else if (percent == 100) {
      return 'Very Strong';
    }
  };

  const getStrokeColor = percent => {
    if (inRange(percent, 0, 50)) {
      return '#f54e60';
    } else if (inRange(percent, 50, 80)) {
      return '#ffa800';
    } else if (inRange(percent, 80, 100)) {
      return '#3abcca';
    }
  };

  return (
    <div className="create-password-container">
      <Title>
        <div className="mb-24">{title}</div>
      </Title>
      <Form
        {...layout}
        layout="vertical"
        name="basic"
        className="create-password-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={<FormattedMessage {...messages.password} />}
          name="password"
          rules={[
            {
              required: true,
              message: <FormattedMessage {...messages.passwordRequired} />,
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z_@./#&+-]{8,}$/;
                if (!value) {
                  setPasswordQuality(null);
                  return Promise.resolve();
                } else {
                  if (passwordRegex.test(value)) {
                    if (value.length >= 20) {
                      setPasswordQuality(100);
                    } else {
                      setPasswordQuality((value.length * 100) / 20);
                    }
                    return Promise.resolve();
                  } else {
                    setPasswordQuality(null);
                    return Promise.reject(
                      <FormattedMessage {...messages.passwordInvalid} />,
                    );
                  }
                }
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        {passwordQuality ? (
          <Progress
            size="small"
            className="password-progress"
            percent={passwordQuality}
            format={formatCheckPassword}
            strokeColor={getStrokeColor(passwordQuality)}
          />
        ) : null}

        <Form.Item
          label={<FormattedMessage {...messages.confirmPassword} />}
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage {...messages.confirmPasswordRequired} />
              ),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  <FormattedMessage {...messages.passwordsNotMatch} />,
                );
              },
            }),
          ]}
        >
          <Input.Password
            onCopy={e => e.preventDefault()}
            onPaste={e => e.preventDefault()}
          />
        </Form.Item>

        {showRequirements ? (
          <div className="password-requirements mb-24">
            <div className="password-requirements-header">
              <FormattedMessage {...messages.passwordRequirement} />
            </div>
            <div className="password-requirements-content">
              <div>
                <FormattedMessage {...messages.passwordRequirement1} />
              </div>
              <div>
                <FormattedMessage {...messages.passwordRequirement2} />
              </div>
              <div>
                <FormattedMessage {...messages.passwordRequirement3} />
              </div>
              <div>
                <FormattedMessage {...messages.passwordRequirement4} />
              </div>
            </div>
          </div>
        ) : null}

        <Form.Item className="submit-layout">
          <Button type="primary" htmlType="submit">
            <FormattedMessage {...messages.resetPassword} />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

CreatePasswordForm.propTypes = {
  title: PropTypes.any,
  showRequirements: PropTypes.bool.isRequired,
  onClickCreatePassword: PropTypes.func,
};

export default memo(CreatePasswordForm);
