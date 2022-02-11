import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
const CheckEventForm = props => {
  const { createContat } = props;
  const { resetForm } = useFormikContext();
  useEffect(() => {
    if (createContat?.success) {
      resetForm();
    }
  }, [createContat]);
  return <span />;
};

export default CheckEventForm;
