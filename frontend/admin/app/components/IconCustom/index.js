/**
 *
 * IconCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import IconInvalid1 from 'images/icons/invalid-name/invalid-name@3x.png';
import IconInvalid2 from 'images/icons/invalid-name-2/invalid-name@3x.png';
import IconInvalid3 from 'images/icons/invalid-name-3/invalid-name@3x.png';
import IconInvalid4 from 'images/icons/invalid-name-4/invalid-name@3x.png';
import IconInvalid5 from 'images/icons/invalid-name-5/invalid-name@3x.png';
import IconInvalid6 from 'images/icons/invalid-name-6/group@3x.png';
import IconInvalid7 from 'images/icons/invalid-name-7/invalid-name@3x.png';
import IconInvalid8 from 'images/icons/invalid-name-8/invalid-name@3x.png';
import './styles.less';
function IconCustom({ type, src, alt, className }) {
  switch (type) {
    case 'icon-invalid-1':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid1}
            alt={IconInvalid1}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-2':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid2}
            alt={IconInvalid2}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-3':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid3}
            alt={IconInvalid3}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-4':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid4}
            alt={IconInvalid4}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-5':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid5}
            alt={IconInvalid5}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-6':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid6}
            alt={IconInvalid6}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-7':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid7}
            alt={IconInvalid7}
            className={`icon-custom-img invalid-icon`}
          />
        </div>
      );
    case 'icon-invalid-8':
      return (
        <div className={`icon-custom-invalid ${className ? className : null}`}>
          <img
            src={IconInvalid8}
            alt={IconInvalid8}
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
