import React, { memo, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { makeSelectClientList } from './selectors';
import { createStructuredSelector } from 'reselect';
import {
  fetchContactListDetail,
  cleanContactListDetail,
} from 'containers/common_provider/client_state/actions';

const CheckEventForm = props => {
  const {
    clientData,
    fetchContactListDetail,
    cleanContactListDetail,
    selectedClient,
    selectedContact,
  } = props;
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    return () => cleanContactListDetail();
  }, [clientData]);

  useEffect(() => {
    if (selectedClient?.id) {
      fetchContactListDetail(selectedClient.id, {
        params: {
          paginate: false,
        },
      });
      setFieldValue('clientId', selectedClient?.id);
    } else {
      setFieldValue('contactFirstName', '');
      setFieldValue('contactLastName', '');
      setFieldValue('email', '');
      setFieldValue('contactNumber', '');
      setFieldValue('clientId', '');
      setFieldValue('clientContactId', '');
    }
    return () => { }
  }, [selectedClient])

  useEffect(() => {
    if (selectedContact) {
      setFieldValue('email', selectedContact.email);
      setFieldValue('contactLastName', selectedContact.last_name);
      setFieldValue('contactNumber', selectedContact.contract_number);
      setFieldValue('clientContactId', selectedContact.id);
    } else {
      setFieldValue('contactLastName', '');
      setFieldValue('email', '');
      setFieldValue('contactNumber', '');
      setFieldValue('clientContactId', '');
    }
    return () => { }
  }, [selectedContact])

  return <span />;
};

const mapStateToProps = createStructuredSelector({
  clientData: makeSelectClientList(),
});

const mapDispatchToProps = {
  fetchContactListDetail,
  cleanContactListDetail,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CheckEventForm);
