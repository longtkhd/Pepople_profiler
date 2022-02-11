/**
 *
 * RecruiterInfo
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import updateRecruiter, {
  clearData,
} from 'containers/common_provider/update_recruiter/actions';
import {
  makeSelectUpdateRecruiterError,
  makeSelectUpdateRecruiterLoading,
} from 'containers/common_provider/update_recruiter/selectors';

import { Form, Input, Row, Col, Button, Descriptions } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';

import { getUserInfo } from 'services/authentication';
import { openNotification } from 'utils/notification';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import { CONFIG } from 'constants/config';
const NOTIFICATION_TYPES = CONFIG.NOTIFICATION_TYPES;

function RecruiterContactInfo(props) {
  const {
    socket,
    recruiterId,
    data,
    editRecruiter,
    updateRecruiterError,
    updateRecruiterLoading,
    onClearData,
  } = props;
  const userInfo = getUserInfo();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      span: 24,
    },
  };

  const onFinish = values => {
    editRecruiter(recruiterId, values);
    if (values?.email && data?.email && values.email !== data.email) {
      socket.emit('clientSendNotification', {
        sender_id: userInfo?.id,
        receiver_id: data.id,
        type: NOTIFICATION_TYPES.EMAIL_HAS_BEEN_UPDATED_BY_ADMIN,
        title: 'Your email address has been updated',
        content: `<div>Your email address has been updated by your company administrator to <span class="notification-content-highlight">${
          values.email
        }</span>. Don\'t forget to use this new email address to log into the platform.</div>`,
      });
    }
  };

  useEffect(() => {
    if (updateRecruiterError) {
      if (updateRecruiterError.message == 'email_already_exist') {
        openNotification(
          'error',
          <FormattedMessage {...messages.emailAlreadyExisted} />,
        );
      } else {
        openNotification('error', updateRecruiterError.message);
      }
    }
    return () => {};
  }, [updateRecruiterError]);

  useEffect(() => {
    onClearData();
    return () => {};
  }, []);

  return (
    <div className="recruiter-contact-info-container">
      <>
        {editMode ? (
          <FormInfoDetail
            title={<FormattedMessage {...messages.title} />}
            className="edit-recruiter-detail-form"
            actions={
              <Row flex="flex" justify="center" align="middle">
                <Col>
                  <Button
                    type="default"
                    onClick={() => setEditMode(false)}
                    className="mr-10 btn-cancel"
                  >
                    <FormattedMessage {...globalMessages.cancel} />
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    className="btn-save"
                    onClick={() => {
                      form.submit();
                    }}
                    loading={updateRecruiterLoading}
                  >
                    <FormattedMessage {...globalMessages.save} />
                  </Button>
                </Col>
              </Row>
            }
          >
            <Form
              name="basic"
              className="recruiter-form"
              {...formItemLayout}
              onFinish={onFinish}
              form={form}
            >
              <Row gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage {...messages.firstName} />}
                    name="first_name"
                    initialValue={data.first_name}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage {...messages.firstNameRequired} />
                        ),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage {...messages.lastName} />}
                    name="last_name"
                    initialValue={data.last_name}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage {...messages.lastNameRequired} />
                        ),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage {...messages.jobTitle} />}
                    name="job_title"
                    initialValue={data.job_title}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage {...messages.jobTitleRequired} />
                        ),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage {...messages.email} />}
                    name="email"
                    initialValue={data.email}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage {...messages.emailRequired} />
                        ),
                      },
                      {
                        type: 'email',
                        message: (
                          <FormattedMessage {...messages.emailInvalid} />
                        ),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage {...messages.contactNumber} />}
                    name="phone_number"
                    initialValue={data.phone_number}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            {...messages.contactNumberRequired}
                          />
                        ),
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value) return Promise.resolve();
                          let passwordRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
                          if (passwordRegex.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              <FormattedMessage
                                {...messages.contactNumberFormat}
                              />,
                            );
                          }
                        },
                      }),
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </FormInfoDetail>
        ) : (
          <FormInfoDetail
            title="Contact Information"
            className="edit-recruiter-detail-form"
            actions={
              <Row flex="flex" justify="center" align="middle">
                <Col>
                  <Button
                    type="default"
                    icon={<i className="action-icon fas fa-edit" />}
                    className="btn-edit"
                    onClick={() => setEditMode(true)}
                  >
                    <FormattedMessage {...globalMessages.edit} />
                  </Button>
                </Col>
              </Row>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={<FormattedMessage {...messages.firstName} />}
              >
                {data.first_name}
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage {...messages.lastName} />}
              >
                {data.last_name}
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage {...messages.jobTitle} />}
              >
                {data.job_title}
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage {...messages.contactNumber} />}
              >
                {data.phone_number}
              </Descriptions.Item>
              <Descriptions.Item
                label={<FormattedMessage {...messages.email} />}
              >
                {data.email}
              </Descriptions.Item>
            </Descriptions>
          </FormInfoDetail>
        )}
      </>
    </div>
  );
}

RecruiterContactInfo.propTypes = {
  recruiterId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  editRecruiter: PropTypes.func,
  updateRecruiterError: PropTypes.object,
  onClearData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  updateRecruiterError: makeSelectUpdateRecruiterError(),
  updateRecruiterLoading: makeSelectUpdateRecruiterLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    editRecruiter: (recruiterId, data) =>
      dispatch(updateRecruiter(recruiterId, data)),
    onClearData: () => dispatch(clearData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruiterContactInfo);
