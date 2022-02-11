/**
 *
 * CandidateReportEditProfile
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCandidateReportEditProfile from './selectors';
import reducer from './reducer';
import messages from './messages';
import { Row, Col } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';
import ButtonCustom from 'components/atoms/Button';
import InputEditCustom from 'components/InputEditCustom';
import CheckEventForm from './CheckEventForm';
import AvatarPlaceholder from 'images/avatar/group-23.png';
import SpanCustom from 'components/SpanCustom';
import {
  editCandidateInfoDetail,
  cleanUpEditCandidate,
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/actions';
import {
  makeSelectEditCandidateResult,
  makeSelectEditCandidateLoad,
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/selectors';
import * as Yup from 'yup';
import { pushNotify } from 'utils/notify';
import './styles.less';
import { Formik } from 'formik';
import { Form } from 'formik-antd';

var decimaReg = /^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/;
const validation = Yup.object({
  phone: Yup.string()
    // .trim('Please remove whitespace')
    // .strict(true)
    .max(15, 'Must be 11 characters or less'),
  current_position: Yup.string(),
  // .trim('Please remove whitespace')
  // .strict(true),
  current_employer: Yup.string(),
  // .trim('Please remove whitespace')
  // .strict(true),
  exp_rem: Yup.string(),
  // .strict(true)
  // .matches(decimaReg, 'Exp.REM is not valid'),
  notice_period: Yup.string(),
  // .trim('Please remove whitespace')
  // .strict(true),
});

export function CandidateReportEditProfile(props) {
  useInjectReducer({ key: 'candidateReportEditProfile', reducer });

  const {
    candidateInfo,
    jobId,
    candidateEditResult,
    candidateEditLoad,
    jobType,
    editCandidateInfoDetail,
    cleanUpEditCandidate,
  } = props;

  const [editToggle, setEditToggle] = useState(false);

  useEffect(() => {
    if (candidateEditResult?.success) {
      setEditToggle(false);
    }
  }, [candidateEditResult]);

  const handleEditToggle = () => {
    setEditToggle(prev => !prev);
  };

  // console.log('candidateEditResult>>',candidateEditResult);

  const handleSaveEdit = values => {
    const exp_rem = jobType !== "Temp" ? values?.exp_rem.replace(/\D/g, '') : values?.exp_rem;

    // console.log('values>>', values);
    const payload = {
      phone: values?.phone,
      current_position: values?.current_position,
      current_employer: values?.current_employer,
      exp_rem: exp_rem,
      notice_period: values?.notice_period,
    };
    editCandidateInfoDetail(candidateInfo?.id, jobId, payload);
  };

  const initialValues = {
    phone: '',
    current_position: '',
    current_employer: '',
    exp_rem: '',
    notice_period: '',
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={candidateInfo || initialValues}
      validationSchema={validation}
      onSubmit={(values, { resetForm }) => {
        handleSaveEdit(values);
        resetForm({ values: candidateInfo });
      }}
    >
      {({ values }) => (
        <Form>
          <div className="profiler">
            <div className="profiler-head">
              <div className="profiler-avatar">
                <img src={AvatarPlaceholder} alt={`avatar profiler`} />
              </div>
              <h2 className={`profiler-name text-22-bold`}>
                {candidateInfo?.candidate_name && candidateInfo.candidate_name}
              </h2>
            </div>

            <div className={`profiler-body`}>
              <Row className={`profiler-wrapper-field`} gutter={[8, 8]}>
                {/* <Col>
                  <Form.Item
                    name="phone"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <InputEditCustom
                      starIcon={false}
                      label={`Phone:`}
                      name="phone"
                      className="label-profile"
                      type="text"
                      info={candidateInfo?.phone && candidateInfo.phone}
                      toggleedit={editToggle ? 'true' : false}
                    />
                  </Form.Item>
                </Col> */}
                <Col>
                  <Form.Item
                    name="current_position"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <InputEditCustom
                      starIcon={false}
                      label={`Current Position:`}
                      name="current_position"
                      type="text"
                      className="label-profile"
                      info={
                        candidateInfo?.current_position &&
                        candidateInfo.current_position
                      }
                      toggleedit={editToggle ? 'true' : false}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="current_employer"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <InputEditCustom
                      starIcon={false}
                      label={`Current Employer:`}
                      className="label-profile"
                      name="current_employer"
                      type="text"
                      info={
                        candidateInfo?.current_employer &&
                        candidateInfo.current_employer
                      }
                      toggleedit={editToggle ? 'true' : false}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="exp_rem"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <InputEditCustom
                      starIcon={false}
                      label={jobType === "Temp" ? `Charge Rate:` : `Expected Remuneration:`}
                      className="label-profile format__number"
                      name="exp_rem"
                      type="text"
                      info={candidateInfo?.exp_rem && candidateInfo.exp_rem}
                      toggleedit={editToggle ? 'true' : false}
                      numberinput={jobType === "Temp" ? false : true}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    name="notice_period"
                    hasFeedback={true}
                    showValidateSuccess={true}
                    className={`wrapper-group-input-ant`}
                  >
                    <InputEditCustom
                      starIcon={false}
                      label={`Notice Period:`}
                      className="label-profile"
                      name="notice_period"
                      type="text"
                      info={
                        candidateInfo?.notice_period &&
                        candidateInfo.notice_period
                      }
                      toggleedit={editToggle ? 'true' : false}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="center" className={`wrapper-btn-edit`}>
                <Col>
                  {!editToggle ? (
                    <ButtonCustom
                      case="static"
                      onClick={handleEditToggle}
                      className={`btn-default-outline`}
                    >
                      <SpanCustom className={'action-icon'}>
                        <i className="fas fa-edit" />
                      </SpanCustom>
                      {'Edit candidate details'}
                    </ButtonCustom>
                  ) : (
                    <ButtonCustom
                      type="submit"
                      className={`btn-default-outline`}
                    >
                      {'Save'}
                    </ButtonCustom>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

CandidateReportEditProfile.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  candidateReportEditProfile: makeSelectCandidateReportEditProfile(),
  candidateEditResult: makeSelectEditCandidateResult(),
  candidateEditLoad: makeSelectEditCandidateLoad(),
});
const mapDispatchToProps = {
  editCandidateInfoDetail,
  cleanUpEditCandidate,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateReportEditProfile);
