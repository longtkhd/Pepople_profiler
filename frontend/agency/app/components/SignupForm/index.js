/**
 *
 * SignupForm
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import getCountryAction from 'containers/common_provider/get_country/actions';
import { makeSelectGetCountryLoading, makeSelectGetCountryResponse} from 'containers/common_provider/get_country/selectors';

import { Form, Input, Button, Row, Col , Select } from 'antd';
import './styles.less';

const { Option } = Select;

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function SignupForm(props) {
  const { 
    onSubmit,
    getCountry,
    countryLoading,
    countryResponse,
  } = props;

  const [countries, setCountries] = useState([]);

  const onFinish = (value) => {
    onSubmit(value)
  }

  useEffect(() => {
    if (countryResponse) {
      setCountries(countryResponse);
    }
    return () => { }
  }, [countryResponse])

  useEffect(() => {
    getCountry();
    return () => { }
  }, [])

  return (
    <Row flex="flex" justify="center" align="middle">
      <Col span="24">
        <Form
          name="basic"
          className="signup-form"
          onFinish={onFinish}
        >
          <Row gutter={32}>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.firstName} />}
                name="first_name"
                rules={[{ required: true, message: <FormattedMessage {...messages.firstNameRequired} /> }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.lastName} />}
                name="last_name"
                rules={[{ required: true, message: <FormattedMessage {...messages.lastNameRequired} /> }]}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.jobTitle} />}
                name="job_title"
                rules={[{ required: true, message: <FormattedMessage {...messages.jobTitleRequired} /> }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
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

          <Row gutter={32}>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.phoneNumber} />}
                name="phone_number"
                rules={[
                  { required: true, message: <FormattedMessage {...messages.phoneNumberRequired} /> },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value) return Promise.resolve()
                      let phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
                      if (phoneRegex.test(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          <FormattedMessage {...messages.contactNumberFormat} />,
                        );
                      }
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.agencyName} />}
                name="agency_name"
                rules={[{ required: true, message: <FormattedMessage {...messages.agencyNameRequired} /> }]}
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
            <Col md={12} sm={12} xs={12}> 
              <Form.Item
                className="signup-form__item"
                labelCol={{ span: 24 }}
                label={<FormattedMessage {...messages.country} />}
                name="country_code"
                initialValue="AU"
                rules={[{ required: true, message: <FormattedMessage {...messages.countryRequired} /> }]}
              >
                <Select 
                  placeholder="Country"
                  loading={countryLoading}
                  showSearch
                  defaultValue="AU"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {countries.map(option => (
                    <Option key={option.id} value={option.code}>
                      {option.name}
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

SignupForm.propTypes = {
  getCountry: PropTypes.func,
  countryLoading: PropTypes.bool,
  countryResponse: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  countryLoading: makeSelectGetCountryLoading(),
  countryResponse: makeSelectGetCountryResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getCountry: () => dispatch(getCountryAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SignupForm);
