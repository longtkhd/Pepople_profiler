/**
 *
 * LoginForm
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col , Select } from 'antd';
import './styles.less';

const { Option } = Select;

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function SignupForm(props) {
  const { onSubmit } = props;

  const countryOptions = [
    { value: 'australia', displayValue: 'Australia' },
    { value: 'vietnam', displayValue: 'Viet Nam' },
  ];

  const onFinish = (value) => {
    onSubmit(value)
  }
  return (
    <Row flex="flex" justify="center" align="middle">
      <Col span="24">
        <Form
          name="basic"
          className="signup-form"
          onFinish={onFinish}
        >
          <Row>
            <Col md={12}> 
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.firstName} />}
                name="first_name"
                rules={[{ required: true, message: <FormattedMessage {...messages.firstNameRequired} /> }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}> 
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.lastName} />}
                name="last_name"
                rules={[{ required: true, message: <FormattedMessage {...messages.lastNameRequired} /> }]}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.jobTitle} />}
                name="job_title"
                rules={[{ required: true, message: <FormattedMessage {...messages.jobTitleRequired} /> }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.email} />}
                name="email"
                rules={[
                  { required: true, message: <FormattedMessage {...messages.emailRequired} /> },
                  { type: 'email', message: <FormattedMessage {...messages.emailInvalid} /> },
                ]}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.phoneNumber} />}
                name="phone_number"
                rules={[{ required: true, message: <FormattedMessage {...messages.phoneNumberRequired} /> }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.agencyName} />}
                name="agency_name"
                rules={[{ required: true, message: <FormattedMessage {...messages.agencyNameRequired} /> }]}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.country} />}
                name="country_code"
                rules={[{ required: true, message: <FormattedMessage {...messages.countryRequired} /> }]}
              >
                <Select placeholder="Country">
                  {countryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.displayValue}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="submit-layout">
            <Button type="primary" htmlType="submit">
              <FormattedMessage {...messages.getStarted} />
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

SignupForm.propTypes = {};

export default memo(SignupForm);
