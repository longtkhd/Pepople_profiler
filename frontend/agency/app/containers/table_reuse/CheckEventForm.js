import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
// import { compose } from 'redux';
import { connect } from 'react-redux';
import { getClientBusiness, getContactDetail } from 'containers/common_provider/create_job_state/actions';
// import { makeSelectClientList, makeSelectContactList } from './selectors';
import { createStructuredSelector } from 'reselect';

const CheckEventForm = props => {
  // console.log('checkForm>>>',props);
  const { recruitmentActivityResult, jobDetail } = props;
  // const { clientData, getClientBusiness, getContactDetail, contactList } = props;
  const { values, setFieldValue, resetForm } = useFormikContext();

  // console.log(`clien>>>`,clientData);

  // const clientList = useMemo(() => {
  //   clientData?.client_list && clientData?.client_list.filter( ({clientId }) ==);
  // }, [ clientData ]);

  // useEffect(() => {
  //   console.log(`jobDetail>>>`,jobDetail?.recruitment_activity);
  // },[])

  useEffect(() => {
    if (jobDetail?.recruitment_activity) {
      jobDetail?.recruitment_activity?.map( (field,index) => {
        // console.log('field>>>',field);
        setFieldValue(`recuitmentActivity[${index}].value`,field?.value)
        // setFieldValue(`recuitmentActivity[${index}].key`,field?.key)
      } )
    }
    if (jobDetail?.exclude_from_report) {
      setFieldValue(`excludeFromReport`,jobDetail?.exclude_from_report)
    }
  },[jobDetail])

  useEffect(() => {
    if (recruitmentActivityResult?.success) {
      // resetForm();
    }
    // console.log('values>>',values);
  }, [recruitmentActivityResult]);
  return <span />;
};

const mapStateToProps = createStructuredSelector({
  // clientData: makeSelectClientList(),
  // contactList: makeSelectContactList(),
});
const mapDispatchToProps = {
  // getClientBusiness,
  // getContactDetail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckEventForm);
