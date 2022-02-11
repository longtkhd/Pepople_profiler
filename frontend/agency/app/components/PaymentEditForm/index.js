/**
 *
 * Paymenteditform
 *
 */

import { Form, Input, InputNumber, Button, Row, Col } from 'antd';
import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import {
  formatCreditCardNumber,
  formatExpirationMonth,
  getDisplayMonth,
  clearNumber,
  getHideCreditCard
} from 'utils/formatInputHelper';

import { FormattedMessage } from 'react-intl';
import messages from '../PaymentInfoForm/messages';
import message from './messages';

import './styles.less';

function PaymentEditForm(props) {
  const { cardInfo, onUpdateCard, onVerifyCard, isEditMode } = props;
  const [isModifyMode, setIsModifyMode] = useState(false);

  const toggleModifyMode = () => setIsModifyMode(prev => !prev);

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
      toggleModifyMode();
    } else {
      onUpdateCard(req);
      toggleModifyMode();
    }
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

  const handleCancel = () => {
    if(!cardInfo) return;
    toggleModifyMode();
    form.resetFields();
  }

  useEffect(() => {
    if(isEditMode){
      setIsModifyMode(true);
    }
  }, [isEditMode]);

  useEffect(() => {
    if(!cardInfo){
      setIsModifyMode(true);
    }
  }, [cardInfo]);

  return (
    <>

      <Form
        name="basic"
        layout="vertical"
        className="payment-form"
        form={form}
        onFinish={onFinish}
      >
        {isModifyMode ? (
        <div className="form-group-container">
          <Row gutter={8}>
            <Col md={12}>
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
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col md={6}>
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

              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={6}>
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
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col md={12}>
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
            <Col md={12}>
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
              >
                <Input onChange={handleChangeCardNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col md={7}>
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
                    >
                      <Input
                        style={{ width: '48%', marginRight: '10px' }}
                        placeholder="MM"
                        onChange={handleChaneExprityMonth}
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
                    >
                      <InputNumber
                        min={2000}
                        max={2099}
                        style={{ width: '48%' }}
                        placeholder="YYYY"
                      />
                    </Form.Item>
                  </Input.Group>
              </Form.Item>
            </Col>
            <Col md={5}>
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
                  <Input style={{ width: '100%' }} onChange={handleChaneCvc}/>
                </Form.Item>
            </Col>
          </Row>
        </div>
        ) : (
          <div className="form-group-container credit-info">
            <Row gutter={8}>
              <Col md={12}>
                <Form.Item
                  label={<FormattedMessage {...messages.creditCard} />}
                >
                  <div className="text-readonly">
                    {cardInfo?.display_number}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
        <div className="submit-layout">
          {isModifyMode || !cardInfo ? (
            <>
              <Button
                type="default"
                style={{ color: '#707070' }}
                onClick={handleCancel}
              >
                <FormattedMessage {...message.cancelButton} />
              </Button>
              <Button type="primary" htmlType="submit">
                <FormattedMessage {...message.saveButton} />
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={toggleModifyMode}>
              <FormattedMessage {...message.editButton} />
            </Button>
          )}
        </div>
      </Form>
    </>
  );
}

PaymentEditForm.propTypes = {
  cardInfo: PropTypes.object,
  onVerifyCard: PropTypes.func,
  onUpdateCard: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default memo(PaymentEditForm);
