/**
 *
 * LoginLayout
 *
 */

import React, { memo } from 'react';
import './styles.less';

function LoginLayout(props) {
  const { children } = props;
  return (
    <div className="login-layout-container">
      {children}
    </div>
  );
}

LoginLayout.propTypes = {};

export default memo(LoginLayout);
