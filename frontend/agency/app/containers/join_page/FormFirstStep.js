import React, { memo, useEffect, useMemo } from 'react';
import { Row, Col } from 'antd';

import InputCustom from 'components/InputCustom/loadable';
import LayouForm from './LayoutForm';
import { pushNotify } from 'utils/notify';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { cleanUpEditPersonal } from './actions';
import { makeSelectEditRecruiterInfo } from './selectors';
import { Form } from 'formik-antd';

const FormFirstStep = props => {
  const { editPersonal } = props;
  // console.log('>>',editPersonal);
  useEffect(() => {
    if (editPersonal?.success) {
      pushNotify({
        type: 'success',
        message: 'Update Personal Success!',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    }
    // return () => cleanUpEditPersonal();
  }, [editPersonal?.success]);

  return (
    <LayouForm {...props}>
      <Row gutter={[{ xs: 8, sm: 16, md: 8 }, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="firstName"
            // hasFeedback={true}
            // showValidateSuccess={true}
            className={`wrapper-group-input-ant`}
          >
            <InputCustom
              styleformgroup={true ? 'validate-block' : 'validate-position'}
              label="First Name"
              name="firstName"
              type="text"
              starIcon={false}
              // value={recruiterProfile.firstname ? recruiterProfile.firstname : ''}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="lastName"
            // hasFeedback={true}
            // showValidateSuccess={true}
            className={`wrapper-group-input-ant`}
          >
            <InputCustom
              label="Last Name"
              name="lastName"
              type="text"
              starIcon={false}
              // value={recruiterProfile?.lastname}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="jobTitle"
            // hasFeedback={true}
            // showValidateSuccess={true}
            className={`wrapper-group-input-ant`}
          >
            <InputCustom
              label="Job Title"
              name="jobTitle"
              type="text"
              starIcon={false}
              // value={recruiterProfile?.jobtitle}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="email"
            hasFeedback={false}
            showValidateSuccess={false}
            className={`wrapper-group-input-ant`}
          >
            <InputCustom
              label="Email"
              name="email"
              type="email"
              starIcon={false}
              disabled
              // value={recruiterProfile?.email}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="phoneNumber"
            // hasFeedback={true}
            // showValidateSuccess={true}
            className={`wrapper-group-input-ant`}
          >
            <InputCustom
              label="Phone Number"
              name="phoneNumber"
              type="text"
              starIcon={false}
              // value={recruiterProfile?.phonenumber}
            />
          </Form.Item>
        </Col>
      </Row>
    </LayouForm>
  );
};

const mapStateToProps = createStructuredSelector({
  editPersonal: makeSelectEditRecruiterInfo(),
});

const mapDispatchToProps = {
  cleanUpEditPersonal,
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withConnect,
  memo,
)(FormFirstStep);
