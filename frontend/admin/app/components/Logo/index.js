/**
 *
 * Logo
 *
 */

import React, { memo } from 'react';
import LogoIcon from 'images/Logo/PNG/Logo-White.png';
import './styles.less';

function Logo() {
  return <img src={LogoIcon} alt={`People Profiler`} className={`logo`}  />
}

Logo.propTypes = {};

export default memo(Logo);
