import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
// import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectCandidateDetailResult,
} from 'containers/common_provider/candidate_state/get_candidate_detail/selectors';
const CheckEventForm = props => {
  // console.log('checkForm>>>',jobDetail);
  const { setFieldValue } = useFormikContext();

  const { candidateDetailInfo } = props;
  // console.log('candidate detai check form event>>>>',candidateDetailInfo);

  useEffect(() => {
    if(candidateDetailInfo) {
      setFieldValue('phone',candidateDetailInfo?.phone);
      setFieldValue('currentPosition',candidateDetailInfo?.current_position);
      setFieldValue('currentEmployer',candidateDetailInfo?.current_employer);
      setFieldValue('expectedRemuneration',candidateDetailInfo?.exp_rem);
      setFieldValue('noticePeriod',candidateDetailInfo?.notice_period);
    }
  }, [ candidateDetailInfo ]);
  return <span />;
};

const mapStateToProps = createStructuredSelector({
  candidateDetailInfo: makeSelectCandidateDetailResult(),
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckEventForm);
