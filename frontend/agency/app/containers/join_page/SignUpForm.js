import React, { memo, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputCustom from 'components/InputCustom/loadable';

const SignUpForm = () => {
  return (
    <>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, { xs: 8, sm: 16, md: 24 }]}>
        <Col span={12}>
          <InputCustom
            label="First Name"
            name="firstName"
            type="text"
            starIcon={true}
          />
        </Col>
        <Col span={12}>
          <InputCustom
            label="Last Name"
            name="lastName"
            type="text"
            starIcon={true}
          />
        </Col>
      </Row>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, { xs: 8, sm: 16, md: 24 }]}>
        <Col span={24}>
          <InputCustom
            label="Job Title"
            name="jobTitle"
            type="text"
            starIcon={true}
          />
        </Col>
      </Row>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, { xs: 8, sm: 16, md: 24 }]}>
        <Col span={24}>
          <InputCustom
            label="Email"
            name="email"
            type="email"
            starIcon={true}
          />
        </Col>
      </Row>
      <Row gutter={[{ xs: 8, sm: 16, md: 24 }, { xs: 8, sm: 16, md: 24 }]}>
        <Col span={24}>
          <InputCustom
            label="Phone Number"
            name="phoneNumber"
            type="text"
            starIcon={true}
          />
        </Col>
      </Row>
    </>
  );
};

export default memo(SignUpForm);
