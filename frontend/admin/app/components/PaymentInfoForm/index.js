/**
 *
 * PaymentInfoForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Button, Checkbox, Row, Col } from 'antd';

import HighlightText from 'components/atoms/HighlightText';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import {
  formatCreditCardNumber,
  formatExpirationMonth,
  getDisplayMonth
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
    onUpdateCard,
    isEditMode,
    cardInfo,
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
    if (!cardInfo) {
      onVerifyCard(req);
    } else {
      onUpdateCard(req);
    }
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
                message: (
                  <FormattedMessage {...messages.addressLineRequired} />
                ),
              },
            ]}
            initialValue={cardInfo?.address_line1}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col md={12}>
          <Form.Item
            label={<FormattedMessage {...messages.addressCity} />}
            name={'address_city'}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage {...messages.addressCityRequired} />
                ),
              },
            ]}
            initialValue={cardInfo?.address_city}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label={<FormattedMessage {...messages.addressCountry} />}
            name={'address_country'}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage {...messages.addressCountryRequired} />
                ),
              },
            ]}
            initialValue={cardInfo?.address_country}
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
            initialValue={cardInfo?.name}
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
                message: (
                  <FormattedMessage {...messages.creditCardRequired} />
                ),
              },
            ]}
            initialValue={
              cardInfo?.card_number
                ? formatCreditCardNumber(cardInfo?.card_number)
                : null
            }
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
                initialValue={
                  cardInfo?.expiry_month
                    ? getDisplayMonth(cardInfo?.expiry_month)
                    : null
                }
              >
                <Input
                  style={{ width: '50%' }}
                  onChange={handleChaneExprityMonth}
                  placeholder="MM"
                />
              </Form.Item>
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
                initialValue={cardInfo?.expiry_year}
              >
                <InputNumber
                  min={2000}
                  max={2099}
                  style={{ width: '50%' }}
                  placeholder="YYYY"
                />
              </Form.Item>
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
            initialValue={cardInfo?.cvc}
          >
            <InputNumber style={{ width: '100%' }} min={0} max={10000} />
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
            <HighlightText>
              <FormattedMessage {...messages.terms} />
            </HighlightText>
          </div>
        </Form.Item>
      ) : null}

      {!isEditMode ? (
        <Form.Item className="submit-layout">
          <Button type="default" onClick={skipPayment}>
            <FormattedMessage {...globalMessages.skip} />
          </Button>
          <Button type="primary" htmlType="submit">
            <FormattedMessage {...globalMessages.continue} />
          </Button>
        </Form.Item>
      ) : (
        <Form.Item className="submit-layout edit">
          {cardInfo ? (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          )}
        </Form.Item>
      )}
    </Form>
  );
}

PaymentInfoForm.propTypes = {
  showTermAndCondition: PropTypes.bool.isRequired,
  onVerifyCard: PropTypes.func,
  onSkipPayment: PropTypes.func,
  onUpdateCard: PropTypes.func,
  isEditMode: PropTypes.bool,
  cardInfo: PropTypes.object,
};

export default memo(PaymentInfoForm);
