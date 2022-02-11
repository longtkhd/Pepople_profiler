import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
// import { compose } from 'redux';
import { connect } from 'react-redux';
import { makeSelectResultClientDetail } from './selectors';
import { createStructuredSelector } from 'reselect';

const CheckEventForm = props => {
  // console.log('checkForm>>>',props);
  const { clientDetail } = props;
  const { setFieldValue } = useFormikContext();


  useEffect(() => {
    // console.log('values', values);
    if (clientDetail) {
      setFieldValue('businessName', clientDetail?.data?.business_name);
      setFieldValue('industry',  clientDetail?.data?.industry);
    }
  }, [clientDetail]);
  return <span />;
};

const mapStateToProps = createStructuredSelector({
  clientDetail: makeSelectResultClientDetail(),
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckEventForm);
