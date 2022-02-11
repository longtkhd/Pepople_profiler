import React, { memo, useState } from 'react';
import TableParsed from './TableParsed';

const StepThree = props => {
  // const { errors, touched } = formikProps;

  return (
    <div {...props}>
      <TableParsed />
    </div>
  );
};

export default memo(StepThree);
