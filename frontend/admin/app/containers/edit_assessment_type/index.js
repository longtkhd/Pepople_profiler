/**
 *
 * EditAssessmentType
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectEditAssessmentType from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import Button from 'components/atoms/Button'
import InputCustom from 'components/InputCustom';
import updateAssessmentDefault from './actions'
import { getAssessmentTypeAdminById } from 'containers/common_provider/get_assessment_type/actions'

import { makeSelectGetAssessmentTypeById } from 'containers/common_provider/get_assessment_type/selectors'
import * as Yup from "yup";
import {
  makeSelectEditAssessmentTypeSuccess,
  makeSelectEditAssessmentTypeError
} from './selectors'
import { openNotification } from 'utils/notification';


export function EditAssessmentType(props) {
  const {
    history,
    onGetAssessmentTypeId,
    assessmentTypeById,
    onEditAssessmentType,
    editSucces,
    editError
  } = props;
  useInjectReducer({ key: 'editAssessmentType', reducer });
  const assessmentId = props.match.params.id;
  useEffect(() => {
    onGetAssessmentTypeId(assessmentId)
    return () => { }
  }, [])

  const initialAssessment = {
    name: assessmentTypeById?.name,
  }

  const assessmentSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required!'),

  });

  const handleUpdate = (values) => {
    console.log(values)
    onEditAssessmentType(assessmentId, values)
  }

  useEffect(() => {
    console.log(props)
    console.log(editSucces)
    if (editSucces) {
      openNotification('success', 'Update Assessment Type success ')

    }

    return () => { }
  }, [editSucces])


  useEffect(() => {
    if (editError) {
      openNotification('error', 'Update Assessment Type error ')

    }

    return () => { }
  }, [editError])




  return (
    <div>
      <Helmet>
        <title>EditAssessmentType</title>
        <meta name="description" content="Description of EditAssessmentType" />
      </Helmet>

      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history}></ButtonBack>
        </div>

        <FormInfoDetail
          title={<FormattedMessage {...messages.updateAssessType} />}
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
      </MainLayout>
    </div>
  );
}

EditAssessmentType.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editAssessmentType: makeSelectEditAssessmentType(),
  assessmentTypeById: makeSelectGetAssessmentTypeById(),
  editSucces: makeSelectEditAssessmentTypeSuccess(),
  editError: makeSelectEditAssessmentTypeError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAssessmentTypeId: (id) => dispatch(getAssessmentTypeAdminById(id)),
    onEditAssessmentType: (assessmentId, data) => dispatch(updateAssessmentDefault(assessmentId, data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(EditAssessmentType);
