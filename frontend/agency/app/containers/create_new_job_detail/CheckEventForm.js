import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
// import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  makeSelectJobDetail,
} from './selectors';
import { createStructuredSelector } from 'reselect';

const CheckEventForm = props => {
  const { jobDetail } = props;
  // console.log('checkForm>>>',jobDetail);
  const { setFieldValue } = useFormikContext();


  useEffect(() => {
    // console.log('values', values);
    if (jobDetail) {
      setFieldValue('jobTitle', jobDetail?.job_title);
      setFieldValue('jobType',  jobDetail?.work_type);
    }
  }, [jobDetail]);
  return <span />;
};

const mapStateToProps = createStructuredSelector({
  jobDetail: makeSelectJobDetail(),
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckEventForm);
