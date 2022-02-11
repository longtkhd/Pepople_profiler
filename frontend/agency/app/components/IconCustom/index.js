/**
 *
 * IconCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import IconInvalid0 from 'images/icons/invalid-name/invalid-name@3x.png';
import IconInvalid1 from 'images/icons/invalid-name-2/invalid-name@3x.png';
import IconInvalid2 from 'images/icons/invalid-name-3/invalid-name@3x.png';
import IconInvalid3 from 'images/icons/invalid-name-4/invalid-name@3x.png';
import IconInvalid4 from 'images/icons/invalid-name-5/invalid-name@3x.png';
import IconInvalid5 from 'images/icons/invalid-name-6/group@3x.png';
import IconInvalid6 from 'images/icons/invalid-name-7/invalid-name@3x.png';
import IconInvalid7 from 'images/icons/invalid-name-8/invalid-name@3x.png';
import './styles.less';
function IconCustom({ type, src, alt, className }) {
  // console.log(`iconCustom>>`,type);
  switch (type) {
    case 0:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid0}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 1:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid1}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 2:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid2}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 3:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid3}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 4:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid4}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 5:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid5}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 6:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid6}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 7:
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid7}
            alt={`icon recuitment ${type}`}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );

    default:
      return (
        <div className={`icon-custom ${className ? className : null}`}>
          <img src={src} alt={alt} className={`icon-custom-img`} />
        </div>
      );
  }
}

IconCustom.propTypes = {};

export default memo(IconCustom);
