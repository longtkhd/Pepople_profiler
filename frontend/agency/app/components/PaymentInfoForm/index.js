/**
 *
 * PaymentInfoForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Button, Checkbox, Row, Col } from 'antd';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import {
  formatCreditCardNumber,
  formatExpirationMonth,
  clearNumber
} from 'utils/formatInputHelper';

const layout = {
  labelCol: { span: 32 },
  wrapperCol: { span: 32 },
};

function PaymentInfoForm(props) {
  const { 
    showTermAndCondition, 
    onVerifyCard, 
    onSkipPayment,
    onBack,
  } = props;

  const [form] = Form.useForm();

  const onFinish = value => {
    const {
      card_number,
      name,
      expiry_month,
      expiry_year,
      cvc,
      address_city,
      address_line1,
      address_country,
    } = value;
    const req = {
      number: card_number.replace(/\s/g, ''),
      name: name,
      expiry_month: expiry_month,
      expiry_year: expiry_year,
      cvc: cvc,
      address_city: address_city,
      address_line1: address_line1,
      address_country: address_country,
    };
    onVerifyCard(req);
  };

  const skipPayment = () => {
    onSkipPayment();
  };

  const handleChangeCardNumber = e => {
    let input = formatCreditCardNumber(e.currentTarget.value);
    form.setFieldsValue({ card_number: input });
  };

  const handleChaneExprityMonth = e => {
    let expiry_month = formatExpirationMonth(e.currentTarget.value);
    form.setFieldsValue({ expiry_month: expiry_month });
  };

  const handleChaneCvc = e => {
    let cvc = clearNumber(e.currentTarget.value);
    form.setFieldsValue({ cvc: cvc });
  }

  const handleChangeYear = e => {
    let year = clearNumber(e.currentTarget.value);
    form.setFieldsValue({ expiry_year: year });
  }

  return (
    <Form
      {...layout}
      name="basic"
      layout="vertical"
      className="payment-form"
      onFinish={onFinish}
      form={form}
    >
      <Row gutter={8}>
        <Col md={24}>
          <Form.Item
            label={<FormattedMessage {...messages.addressLine} />}
            name="address_line1"
            rules={[
              {
                required: true,
                message: <FormattedMessage {...messages.addressLineRequired} />,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col md={12}>
          <Form.Item
            label={<FormattedMessage {...messages.addressCity} />}
            name="address_city"
            rules={[
              {
                required: true,
                message: <FormattedMessage {...messages.addressCityRequired} />,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label={<FormattedMessage {...messages.addressCountry} />}
            name="address_country"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage {...messages.addressCountryRequired} />
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col md={24}>
          <Form.Item
            label={<FormattedMessage {...messages.cardName} />}
            name="name"
            rules={[
              {
                required: true,
                message: <FormattedMessage {...messages.cardNameRequired} />,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col md={24}>
          <Form.Item
            label={<FormattedMessage {...messages.creditCard} />}
            name="card_number"
            rules={[
              {
                required: true,
                message: <FormattedMessage {...messages.creditCardRequired} />,
              },
            ]}
          >
            <Input
              style={{ width: '100%' }}
              onChange={handleChangeCardNumber}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col md={14}>
          <Form.Item
            label={<FormattedMessage {...messages.expiryDate} />}
            className="expiry-date-container"
          >
            <Input.Group compact>
              <Col md={12}>
                <Form.Item
                  name="expiry_month"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage {...messages.expiryMonthRequired} />
                      ),
                    },
                  ]}
                >
                  <Input
                    onChange={handleChaneExprityMonth}
                    placeholder="MM"
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  name="expiry_year"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage {...messages.expiryYearRequired} />
                      ),
                    },
                  ]}
                >
                  <Input
                    placeholder="YYYY"
                    onChange={handleChangeYear}
                  />
                </Form.Item>
              </Col>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col md={10}>
          <Form.Item
            label={<FormattedMessage {...messages.cvc} />}
            name="cvc"
            rules={[
              {
                required: true,
                message: <FormattedMessage {...messages.cvcRequired} />,
              },
            ]}
          >
            <Input style={{ width: '100%' }} onChange={handleChaneCvc} />
          </Form.Item>
        </Col>
      </Row>

      {showTermAndCondition ? (
        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                !value
                  ? Promise.reject(
                      <FormattedMessage {...messages.termRequired} />,
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <div className="agreement">
            <Checkbox>
              <FormattedMessage {...messages.clickingContinue} /> &nbsp;
            </Checkbox>
            <div className="color-primary bold-text">
              <FormattedMessage {...messages.terms} />
            </div>
          </div>
        </Form.Item>
      ) : null}

      <Form.Item className="submit-layout">
        <Button type="primary" onClick={() => onBack()}>
          <FormattedMessage {...globalMessages.back} />
        </Button>
        <Button type="default" onClick={skipPayment}>
          <FormattedMessage {...globalMessages.skip} />
        </Button>
        <Button type="primary" htmlType="submit">
          <FormattedMessage {...globalMessages.continue} />
        </Button>
      </Form.Item>
    </Form>
  );
}

PaymentInfoForm.propTypes = {
  showTermAndCondition: PropTypes.bool.isRequired,
  onVerifyCard: PropTypes.func,
  onSkipPayment: PropTypes.func,
  onBack: PropTypes.func,
};

export default memo(PaymentInfoForm);
