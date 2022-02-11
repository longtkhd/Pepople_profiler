/**
 *
 * EditProjectAssessment
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
import makeSelectEditProjectAssessment from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import Button from 'components/atoms/Button'
import InputCustom from 'components/InputCustom';

import { makeSelectGetProjectAssessmentById } from 'containers/common_provider/project_assessment/selectors'
import { getProjectAssessmentInfo } from 'containers/common_provider/project_assessment/actions'
import editProjectAssessmentDefault from 'containers/common_provider/project_assessment/edit_project_assessment/actions'
import {
  makeSelectEditProjectAssessmentSuccess,
  makeSelectEditProjectAssessmentError
} from 'containers/common_provider/project_assessment/edit_project_assessment/selectors'
import * as Yup from "yup";
import { openNotification } from 'utils/notification';
import SelectCustom from 'components/SelectCustom'
import getAssessmentDefault from 'containers/common_provider/get_assessment/actions'
import { makeSelectGetAssessment } from 'containers/common_provider/get_assessment/selectors'
import getAssessmentTypeDefault from 'containers/common_provider/get_assessment_type/actions'
import { makeSelectGetAssessmentType } from 'containers/common_provider/get_assessment_type/selectors'


export function EditProjectAssessment(props) {
  const {
    history,
    onGetProjectById,
    projectAssessmentInfo,
    onEditProject,
    editSuccess,
    editError,
    onGetAssIndustry,
    onGetAssessmentType,
    assessmentIndustry,
    assessmentType
  } = props;

  const projectId = props.match.params.id;

  useInjectReducer({ key: 'editProjectAssessment', reducer });

  const initialAssessment = {
    name: projectAssessmentInfo?.data?.name,
    project_access_key: projectAssessmentInfo?.data?.project_access_key,
    industry: projectAssessmentInfo?.data?.industry,
    type: projectAssessmentInfo?.data?.type
  }


  useEffect(() => {
    onGetAssIndustry()
    return () => { }
  }, []);

  useEffect(() => {
    onGetAssessmentType()
    return () => { }
  }, []);


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

  const projectAssessmentSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required!'),
    project_access_key: Yup.string()
      .required('Required!'),
    industry: Yup.string()
      .required('Required!'),
    type: Yup.string()
      .required('Required!'),
  });

  useEffect(() => {
    onGetProjectById(projectId)
    return () => { }
  }, [])

  useEffect(() => {
    if (editSuccess) {
      openNotification('success', 'Update Project Assessment success ')

    }

    return () => { }
  }, [editSuccess])

  useEffect(() => {
    if (editError) {
      openNotification('error', 'Update Project Assessment error ')

    }

    return () => { }
  }, [editError])

  const handleUpdate = (values) => {
    onEditProject(projectId, values)
  }

  return (
    <div>
      <Helmet>
        <title>EditProjectAssessment</title>
        <meta
          name="description"
          content="Description of EditProjectAssessment"
        />
      </Helmet>

      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history} />

        </div>

        <FormInfoDetail
          title={<FormattedMessage {...messages.updateProject} />}
          actions={
            <Row className="action-group" gutter={[8, 0]}>
              <Col>
                <Button className="btn-default-outline ">
                  {/* <EditOutlined className="icon-btn" /> */}
                  <FormattedMessage {...messages.update} />
                </Button>
              </Col>

            </Row>
          }
          case="use-form"
          initialValues={
            initialAssessment
          }
          enableReinitialize
          validationSchema={projectAssessmentSchema}
          onSubmit={(values) => {
            handleUpdate(values)

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
                label="Name"
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



              // defaultValue="lucy"
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
      </MainLayout>
    </div>
  );
}

EditProjectAssessment.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editProjectAssessment: makeSelectEditProjectAssessment(),
  projectAssessmentInfo: makeSelectGetProjectAssessmentById(),
  editSuccess: makeSelectEditProjectAssessmentSuccess(),
  editError: makeSelectEditProjectAssessmentError(),
  assessmentIndustry: makeSelectGetAssessment(),
  assessmentType: makeSelectGetAssessmentType(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetProjectById: (id) => dispatch(getProjectAssessmentInfo(id)),
    onEditProject: (id, data) => dispatch(editProjectAssessmentDefault(id, data)),
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
)(EditProjectAssessment);
