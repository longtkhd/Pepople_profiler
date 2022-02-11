/**
 *
 * ClientFeedbackForm
 *
 */

import { Col, Form, Row, Button, Radio, Rate, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import Container from 'components/Container';
import React, { memo, useEffect, useState } from 'react'
import { StarOutlined, MessageOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ClientFeedbackForm(props) {
  const { classNames, onFeedback, disableSubmit, feedback, contactEmail, jobType, interviewStatus, onInterview } = props;
  const [form] = Form.useForm();
  const buttonStyle = {
    backgroundColor: classNames?.buttonColor
  }
  const [rate, setRate] = useState();

  useEffect(() => {
    if (feedback) {
      form.setFields([
        { name: 'email', value: feedback?.email },
        { name: 'comment', value: feedback?.comment },
        { name: 'rate', value: feedback?.rate },
        { name: 'status', value: feedback?.status.toString() },
      ])
      setRate(feedback?.rate)
    }
  }, [feedback])

  return (
    <div className="feed-back-form">
      <Form
        form={form}
        layout='vertical'
        onFinish={values => {
          onFeedback(values);
          form.resetFields();
        }}
      >
        <Container>
          <Row justify="center">
            <Col xl={12}>
              <Form.Item
                name="email"
                initialValue={contactEmail}
                label={<FormattedMessage {...messages.emailLable} />}
                rules={[{
                  required: true,
                  type: 'email',
                  message: <FormattedMessage {...messages.emailMessage} />
                }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Col xl={12}>
              <Form.Item
                name="comment"
                initialValue={feedback?.comment}
                label={<FormattedMessage {...messages.feedBack} />}
              >
                <TextArea
                  rows={5}
                  bordered={true}
                  onChange={e => {
                    form.setFieldsValue({ comment: e.currentTarget.value });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center" align="middle">
            <Col xl={12} className={'rate'} style={{ textAlign: 'center' }}>
              {jobType && jobType !== "Contract" ?
                <>
                  <Form.Item name="rate" initialValue={feedback?.rate}>
                    <span style={{ fontSize: '18px', color: '#32363e' }}>
                      <FormattedMessage {...messages.rate} />
                    </span>
                    &nbsp;
                    <Rate
                      className={`star-rate`}
                      value={rate}
                      onChange={value => {
                        setRate(value)
                        form.setFieldsValue({
                          rate: value,
                        });
                      }}
                    />
                  </Form.Item>
                </>
                : null
              }

              <Form.Item name="status" initialValue={"1"}>
                <Radio.Group>
                  <Radio.Button value="1" className={'status-button'}>
                    <StarOutlined style={{ marginRight: '10px' }} />
                    <FormattedMessage {...messages.interested} />
                  </Radio.Button>
                  <Radio.Button value="2" className={'status-button'}>
                    <MessageOutlined style={{ marginRight: '10px' }} />
                    <FormattedMessage {...messages.discuss} />
                  </Radio.Button>

                  {
                    !interviewStatus || interviewStatus === 0 ?
                      <Radio.Button
                        className={'status-button'}
                        style={{ cursor: 'pointer', color: '#fff' }}
                        onClick={() => onInterview()}
                      >
                        <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 18 }} icon={faComments} />
                        <FormattedMessage {...messages.interview} />
                      </Radio.Button> : null
                  }

                  {
                    interviewStatus === 1 ?
                      <Radio.Button
                        className={'status-button'}
                        style={{ cursor: 'pointer', color: '#ffa900' }}
                        onClick={() => onInterview()}
                      >
                        <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 18 }} icon={faSpinner} />
                        <FormattedMessage {...messages.interview} />
                      </Radio.Button> : null
                  }

                  {
                    interviewStatus === 2 ?
                      <Radio.Button
                        className={'status-button'}
                        style={{
                          color: 'white',
                          background: '#87cb16',
                        }}
                        onClick={() => onInterview()}
                      >
                        <FontAwesomeIcon style={{ marginLeft: 5, paddingRight: 5, fontSize: 18 }} icon={faComments} />
                        <FormattedMessage {...messages.interview} />
                      </Radio.Button> : null
                  }
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Container>

        <div className="submmit-button" style={{ marginBottom: '50px' }}>
          <Row justify="center" align="middle" className>
            <Col xl={12} className={'rate'} style={{ textAlign: 'center' }}>
              <Button
                size="large"
                disabled={disableSubmit ? true : false}
                className={'bgApi-w'}
                style={
                  { ...buttonStyle }
                }
                htmlType="submit"
              >
                <FormattedMessage {...messages.submit} />
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}

ClientFeedbackForm.propTypes = {
  classNames: PropTypes.object,
  onFeedback: PropTypes.func,
  disableSubmit: PropTypes.bool,
};

export default memo(ClientFeedbackForm);
