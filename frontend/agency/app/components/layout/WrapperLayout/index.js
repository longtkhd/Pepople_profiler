/**
 *
 * WrapperLayout
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import './styles.less';

function WrapperLayout(props) {
  const { children } = props;
  return (
    <div className="layout-container">
      {children}
    </div>
  );
}

WrapperLayout.propTypes = {};

export default memo(WrapperLayout);
