import React from 'react';
import { Button } from 'antd';

const ButtonStep = ({ step ,disabled}) => {
  switch (step) {
    case 1:
      return (
        <>
          <Button htmlType="submit" disabled={disabled} className="button-next">
            Next
          </Button>
        </>
      );
    case 2:
      return (
        <>
          <Button htmlType="submit" disabled={disabled} className="button-next">
            Create
          </Button>
        </>
      );
    default:
      return <></>;
  }
};

export default ButtonStep;
