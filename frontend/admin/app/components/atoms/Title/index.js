/**
 *
 * Title
 *
 */

import React, { memo } from 'react';
import './styles.less';

function Title(props) {
  const { children } = props;
  return (
    <div className="title">
      {children}
    </div>
  );
}

Title.propTypes = {};

export default memo(Title);
