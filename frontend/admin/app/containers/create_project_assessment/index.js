/**
 *
 * CreateProjectAssessment
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
// import makeSelectCreateProjectAssessment from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import Button from 'components/atoms/Button'
import InputCustom from 'components/InputCustom';
import createProjectAssessmentDefault from 'containers/common_provider/project_assessment/create_project_assessment/actions'
import {
  makeSelectCreateProjectAssessmentSuccess,
  makeSelectCreateProjectAssessmentError
} from 'containers/common_provider/project_assessment/create_project_assessment/selectors'
import { openNotification } from 'utils/notification';
import * as Yup from "yup";
import SelectCustom from 'components/SelectCustom'
import getAssessmentDefault from 'containers/common_provider/get_assessment/actions'
import { makeSelectGetAssessment } from 'containers/common_provider/get_assessment/selectors'
import getAssessmentTypeDefault from 'containers/common_provider/get_assessment_type/actions'
import { makeSelectGetAssessmentType } from 'containers/common_provider/get_assessment_type/selectors'

export function CreateProjectAssessment(props) {
  const {
    history,
    onCreateProject,
    createSuccess,
    createError,
    onGetAssIndustry,
    onGetAssessmentType,
    assessmentIndustry,
    assessmentType
  } = props;

  useEffect(() => {
    onGetAssIndustry()
    return () => { }
  }, []);

  useEffect(() => {
    onGetAssessmentType()
    return () => { }
  }, []);


  useInjectReducer({ key: 'createProjectAssessment', reducer });

  const initialAssessment = {
    name: '',
    project_access_key: '',
    industry: '',
    type: ''
  }

  const createSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required!'),
    project_access_key: Yup.string()
      .required('Required!'),
    industry: Yup.string()
      .required('Required!'),
    type: Yup.string()
      .required('Required!'),

  });

  const handleSubmit = (values) => {
    onCreateProject(values)
  }


  useEffect(() => {
    if (createSuccess) {

      openNotification('success', 'Create Project Assessment success ')


    }
  }, [createSuccess])

  useEffect(() => {
    if (createError) {

      openNotification('error', 'Create Project Assessment error ')


    }
  }, [createError])

  const IndustryNameOptions = useMemo(() => {
    let options = [];
    assessmentIndustry &&
      assessmentIndustry.map(({ id, name }) => {
        options.push({
          value: id,
          label:
            name
        });
      });
    return options;
  }, [assessmentIndustry]);

  const AssessmentTypeOptions = useMemo(() => {
    let options1 = [];
    assessmentType &&
      assessmentType.map(({ id, name }) => {
        options1.push({
          value: id,
          label:
            name
        });
      });
    return options1;
  }, [assessmentType]);



  return (
    <div>
      <Helmet>
        <title>CreateProjectAssessment</title>
        <meta
          name="description"
          content="Description of CreateProjectAssessment"
        />
      </Helmet>
      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />

          <div className="project-assessment-form">
            <FormInfoDetail
              title={<FormattedMessage {...messages.addProject} />}
              actions={
                <Row className="action-group" gutter={[8, 0]}>
                  <Col>
                    <Button className="btn-default-outline ">
                      {/* <EditOutlined className="icon-btn" /> */}
                      <FormattedMessage {...messages.addNew} />
                    </Button>
                  </Col>

                </Row>
              }
              case="use-form"
              initialValues={
                initialAssessment
              }
              validationSchema={createSchema}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values)
                resetForm({ values: '' })
              }}

            >

              <Row
                justify="start"
                align="left"
                gutter={[
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                ]}
              >
                <Col xs={24} sm={12} md={12} lg={6}>
                  <InputCustom
                    starIcon={true}
                    styleformgroup={`mb- 20`}
                    label="name"
                    name="name"
                    type="text"
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <SelectCustom styleformgroup={`mb-20`}
                    starIcon={true}
                    label="Industry Name"
                    id="industry"
                    name="industry"
                    options={IndustryNameOptions}
                  // defaultValue={1}
                  >
                  </SelectCustom>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <SelectCustom styleformgroup={`mb-20`}
                    starIcon={true}
                    label="Type Name"
                    id="type"
                    name="type"
                    options={AssessmentTypeOptions}
                    defaultValue="lucy"
                  >
                  </SelectCustom>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <InputCustom
                    starIcon={true}
                    styleformgroup={`mb- 20`}
                    label="Project Access Key"
                    name="project_access_key"
                    type="text"
                  />
                </Col>


              </Row>

            </FormInfoDetail>
          </div>

        </div>
      </MainLayout>
    </div>
  );
}

CreateProjectAssessment.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // createProjectAssessment: makeSelectCreateProjectAssessment(),
  createSuccess: makeSelectCreateProjectAssessmentSuccess(),
  createError: makeSelectCreateProjectAssessmentError(),
  assessmentIndustry: makeSelectGetAssessment(),
  assessmentType: makeSelectGetAssessmentType(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCreateProject: (data) => dispatch(createProjectAssessmentDefault(data)),
    onGetAssIndustry: () => dispatch(getAssessmentDefault()),
    onGetAssessmentType: () => dispatch(getAssessmentTypeDefault()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateProjectAssessment);
