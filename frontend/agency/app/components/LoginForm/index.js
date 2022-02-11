/**
 *
 * LoginForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

const layout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 24 },
};

function LoginForm(props) {
  const { onSubmit, loading } = props;

  const onFinish = values => {
    onSubmit(values);
  };

  return (
    <Row flex="flex" justify="center" align="middle">
      <Col span="24">
        <Form
          {...layout}
          layout="vertical"
          name="basic"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label={<FormattedMessage {...messages.email} />}
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

          <Form.Item
            label={<FormattedMessage {...messages.password} />}
            name="password"
            rules={[
              {
                required: true,
                message: <FormattedMessage {...messages.passwordRequired} />,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="advance-function">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>
                <FormattedMessage {...messages.rememberMe} />
              </Checkbox>
            </Form.Item>

            <Link className="login-form-forgot" to="/forgot-password">
              <FormattedMessage {...messages.forgotPassword} />
            </Link>
          </Form.Item>

          <Form.Item className="submit-layout">
            <Button type="primary" loading={loading} htmlType="submit">
              <FormattedMessage {...messages.login} />
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default memo(LoginForm);
