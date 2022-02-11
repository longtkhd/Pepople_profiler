/**
 *
 * CreateAssessmentType
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
import makeSelectCreateAssessmentType from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import Button from 'components/atoms/Button'
import * as Yup from "yup";
import InputCustom from 'components/InputCustom';
import ButtonBack from 'components/ButtonBack'
import { createAssType } from 'containers/common_provider/create_assessment_type/actions'
import {
  makeSelectCreateAssessmentTypeSuccess,
  makeSelectCreateAssessmentTypeError
} from 'containers/common_provider/create_assessment_type/selectors'
import { openNotification } from 'utils/notification';

export function CreateAssessmentType(props) {
  const {
    history,
    onCreateAssessmentType,
    createAssessmentTypeSuccess,
    createAssessmentTypeError
  } = props;
  useInjectReducer({ key: 'createAssessmentType', reducer });
  const initialAssessment = {
    name: '',
  }


  const createSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required!'),




  });

  const handleSubmit = (values) => {
    console.log(values)
    onCreateAssessmentType(values)
  }
  useEffect(() => {
    if (createAssessmentTypeSuccess) {
      console.log(createAssessmentTypeSuccess)
      openNotification('success', 'Create Assessment Type success ')
    }
  }, [createAssessmentTypeSuccess])

  return (
    <div>
      <Helmet>
        <title>CreateAssessmentType</title>
        <meta
          name="description"
          content="Description of CreateAssessmentType"
        />
      </Helmet>
      <MainLayout>
        <div className="bnt-back">
          <ButtonBack history={history} />
        </div>
        <div className="assessment-type">
          <FormInfoDetail
            title={<FormattedMessage {...messages.addAssessment} />}
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
                  label="Name"
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

CreateAssessmentType.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createAssessmentType: makeSelectCreateAssessmentType(),
  createAssessmentTypeSuccess: makeSelectCreateAssessmentTypeSuccess(),
  createAssessmentTypeError: makeSelectCreateAssessmentTypeError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCreateAssessmentType: (data) => dispatch(createAssType(data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateAssessmentType);
