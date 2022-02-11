import React, { memo, useState } from 'react';
import TableUploadResume from './TableUploadResume'

const StepTwo = props => {
  // const { errors, touched } = formikProps;

  return (
    <div {...props}>
      <TableUploadResume />
    </div>
  );
};

export default memo(StepTwo);
