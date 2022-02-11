/**
 *
 * Logo
 *
 */

import React, { memo } from 'react';
import LogoIcon from 'images/Logo/PNG/Logo-White.png';
import './styles.less';
import { imageEncode } from 'utils/companyImageHelper';

function Logo({ logo }) {
  const imageString = imageEncode(logo);
  return <img src={imageString ? imageString : LogoIcon} alt={`People Profiler`} className={`logo ${imageString && `company-logo`}`}  />
}

Logo.propTypes = {};

export default memo(Logo);
