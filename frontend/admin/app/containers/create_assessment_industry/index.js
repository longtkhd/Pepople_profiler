/**
 *
 * CreateAssessmentIndustry
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
import makeSelectCreateAssessmentIndustry from './selectors';
import reducer from './reducer';
import messages from './messages';
import MainLayout from 'components/layout/MainLayout'
import ButtonBack from 'components/ButtonBack'
import FormInfoDetail from 'components/FormInfoDetail'
import { Row, Col } from 'antd'
import Button from 'components/atoms/Button'
import InputCustom from 'components/InputCustom';

import createAssessmentIndustryDefault from 'containers/common_provider/create_assessment_industry/actions'
import { makeSelectCreateAssessmentIndustrySuccess, makeSelectCreateAssessmentIndustryError } from 'containers/common_provider/create_assessment_industry/selectors'
import { openNotification } from 'utils/notification';
import * as Yup from "yup";

export function CreateAssessmentIndustry(props) {
  const {
    history,
    onCreateAssIndustry,
    createAssIndustrySuccess,
    createAssIndustryError
  } = props;
  useInjectReducer({ key: 'createAssessmentIndustry', reducer });
  const initialAssessment = {
    name: '',
  }


  const handleSubmit = (values) => {
    onCreateAssIndustry(values)
    //create api
    // console.log(values)
  }

  useEffect(() => {
    console.log(createAssIndustrySuccess)
    if (createAssIndustrySuccess) {

      openNotification('success', 'Create Assessment Industry success ')


    }
  }, [createAssIndustrySuccess])


  useEffect(() => {
    if (createAssIndustryError) {
      openNotification('error', 'Create Assessment Industry Error')
    }
  })

  const createSchema = Yup.object().shape({
    name: Yup.string()
      .required('Required!')
      .trim('Please remove whitespace')
      .strict(true)
  });


  return (
    <div>
      <Helmet>
        <title>CreateAssessmentIndustry</title>
        <meta
          name="description"
          content="Description of CreateAssessmentIndustry"
        />
      </Helmet>


      <MainLayout>
        <div className="btn-back">
          <ButtonBack history={history}></ButtonBack>

        </div>
        <div className="assessment-industry">
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

CreateAssessmentIndustry.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createAssessmentIndustry: makeSelectCreateAssessmentIndustry(),
  createAssIndustrySuccess: makeSelectCreateAssessmentIndustrySuccess(),
  createAssIndustryError: makeSelectCreateAssessmentIndustryError()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onCreateAssIndustry: (data) => dispatch(createAssessmentIndustryDefault(data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CreateAssessmentIndustry);
