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

import updateRecruiter from 'containers/common_provider/update_recruiter/actions';
import {
  makeSelectUpdateRecruiterError,
  makeSelectUpdateRecruiterResponse,
} from 'containers/common_provider/update_recruiter/selectors';

import { Form, Input, Row, Col, Button, Descriptions } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';

import { EditOutlined } from '@ant-design/icons';
import { openNotification } from 'utils/notification';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

function RecruiterContactInfo(props) {
  const {
    recruiterId,
    data,
    editRecruiter,
    updateRecruiterError,
    updateRecruiterResponse,
  } = props;
  const [editMode, setEditMode] = useState(false);

  const formItemLayout = {
    labelCol: {
      span: 24,
    },
  }

  const onFinish = values => {
    editRecruiter(recruiterId, values);
  }

  useEffect(() => {
    if (updateRecruiterResponse) {
      setEditMode(false);
      openNotification('success', 'Update Recruiter Successfully');
    }
    return () => { }
  }, [updateRecruiterResponse])

  useEffect(() => {
    if (updateRecruiterError) {
      openNotification('error', updateRecruiterError.message);
    }
    return () => { }
  }, [updateRecruiterError])

  return (
    <div className="recruiter-contact-info-container">
      <>
        {
          editMode ? (
            <FormInfoDetail
              title={<FormattedMessage {...messages.title} />}
            >
              <Form
                name="basic"
                className="recruiter-form"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.firstName} />}
                      name="first_name"
                      initialValue={data.first_name}
                      rules={[{ required: true, message: <FormattedMessage {...messages.firstNameRequired} /> }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.lastName} />}
                      name="last_name"
                      initialValue={data.last_name}
                      rules={[{ required: true, message: <FormattedMessage {...messages.lastNameRequired} /> }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.jobTitle} />}
                      name="job_title"
                      initialValue={data.job_title}
                      rules={[{ required: true, message: <FormattedMessage {...messages.jobTitleRequired} /> }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.email} />}
                      name="email"
                      initialValue={data.email}
                      rules={[
                        { required: true, message: <FormattedMessage {...messages.emailRequired} /> },
                        { type: "email", message: <FormattedMessage {...messages.emailInvalid} /> }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.contactNumber} />}
                      name="phone_number"
                      initialValue={data.phone_number}
                      rules={[{ required: true, message: <FormattedMessage {...messages.contactNumberRequired} /> }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item className="recruiter-form-buttons">
                  <Button
                    type="default"
                    onClick={() => setEditMode(false)}
                    className="mr-10"
                  >
                    <FormattedMessage {...globalMessages.cancel} />
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    <FormattedMessage {...globalMessages.save} />
                  </Button>
                </Form.Item>
              </Form>
            </FormInfoDetail>
          ) : (
              <FormInfoDetail
                title="Contact Information"
                actions={
                  <Row flex="flex" justify="center" align="middle">
                    <Col>
                      <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => setEditMode(true)}
                      >
                        <FormattedMessage {...globalMessages.edit} />
                      </Button>
                    </Col>
                  </Row>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label={<FormattedMessage {...messages.firstName} />}>{data.first_name}</Descriptions.Item>
                  <Descriptions.Item label={<FormattedMessage {...messages.lastName} />}>{data.last_name}</Descriptions.Item>
                  <Descriptions.Item label={<FormattedMessage {...messages.jobTitle} />}>{data.job_title}</Descriptions.Item>
                  <Descriptions.Item label={<FormattedMessage {...messages.contactNumber} />}>{data.phone_number}</Descriptions.Item>
                  <Descriptions.Item label={<FormattedMessage {...messages.email} />}>{data.email}</Descriptions.Item>
                </Descriptions>
              </FormInfoDetail>
            )
        }
      </>
    </div>
  )
}

RecruiterContactInfo.propTypes = {
  recruiterId: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  editRecruiter: PropTypes.func,
  updateRecruiterError: PropTypes.object,
  updateRecruiterResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  updateRecruiterError: makeSelectUpdateRecruiterError(),
  updateRecruiterResponse: makeSelectUpdateRecruiterResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    editRecruiter: (recruiterId, data) => dispatch(updateRecruiter(recruiterId, data)),
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