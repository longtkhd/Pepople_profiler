import React, { memo } from 'react';
import CreatePasswordForm from 'components/CreatePasswordForm';
import LayoutForm from './LayoutForm';

const FormSecondStep = props => {
  const { onClickCreatePassword } = props;
  return (
    <LayoutForm {...props}>
      <CreatePasswordForm 
        showRequirements={true}
        onClickCreatePassword={onClickCreatePassword}
      />
    </LayoutForm>
  );
};

export default memo(FormSecondStep);
