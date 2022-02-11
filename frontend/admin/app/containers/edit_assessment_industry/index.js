/**
 *
 * EditAssessmentIndustry
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectEditAssessmentIndustry,
  makeSelectEditAssessmentIndustryLoading,
  makeSelectEditAssessmentIndustrySuccess,
  makeSelectEditAssessmentIndustryError
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import Button from 'components/atoms/Button'
import InputCustom from 'components/InputCustom';
import { makeSelectGetAssessmentById } from 'containers/common_provider/get_assessment/selectors'
import { getAssessmentAdminById } from 'containers/common_provider/get_assessment/actions'
import * as Yup from "yup";
import editAssessmentDefault from './actions'
import { openNotification } from 'utils/notification';



export function EditAssessmentIndustry(props) {
  const {
    history,
    assessmentIndustryById,
    onGetAssessmentById,
    onEditAssessment,
    editAssessmentSuccess,
    editAssessmentError

  } = props;
  const assessmentId = props.match.params.id;
  useInjectReducer({ key: 'editAssessmentIndustry', reducer });

  const initialAssessment = {
    name: assessmentIndustryById?.name,
  }



  useEffect(() => {
    onGetAssessmentById(assessmentId)
    return () => { }
  }, [])

  useEffect(() => {
    if (editAssessmentSuccess) {
      openNotification('success', 'Update Assessment Industry success ')

    }

    return () => { }
  }, [editAssessmentSuccess])

  useEffect(() => {
    if (editAssessmentError) {
      openNotification('error', 'Update Assessment Industry error ')

    }

    return () => { }
  }, [editAssessmentError])


  const assessmentSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required!'),

  });

  const handleUpdate = (values) => {
    console.log(values)
    onEditAssessment(assessmentId, values)
  }







  return (
    <div>
      <Helmet>
        <title>EditAssessmentIndustry</title>
        <meta
          name="description"
          content="Description of EditAssessmentIndustry"
        />
      </Helmet>
      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history}></ButtonBack>


        </div>

        <div className="assessment-industry">
          <FormInfoDetail
            title={<FormattedMessage {...messages.updateAssessIn} />}
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
            initialValues={initialAssessment}
            enableReinitialize
            // defaultValues={name}
            validationSchema={assessmentSchema}
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
                  label="name"
                  name="name"
                  type="text"
                />
              </Col>

            </Row>

          </FormInfoDetail>

        </div>
      </MainLayout>
    </div>
  );
}

EditAssessmentIndustry.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editAssessmentIndustry: makeSelectEditAssessmentIndustry(),
  assessmentIndustryById: makeSelectGetAssessmentById(),
  editAssessmentSuccess: makeSelectEditAssessmentIndustrySuccess(),
  editAssessmentError: makeSelectEditAssessmentIndustryError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAssessmentById: (assessmentId) => dispatch(getAssessmentAdminById(assessmentId)),
    onEditAssessment: (assessmentId, data) => dispatch(editAssessmentDefault(assessmentId, data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(EditAssessmentIndustry);
