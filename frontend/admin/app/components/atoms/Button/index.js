/**
 *
 * Button
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './styles.less';

function ButtonWrapper(props) {
  return props.case === 'static' ? (
    <div onClick={props.onClick} {...props} className={`btn ${props.className}`}>
      {props.children}
    </div>
  ) : (
    <button onClick={props.onClick} {...props} className={`btn ${props.className}`}>
      {props.children}
    </button>
  )
}

ButtonWrapper.propTypes = {};

export default memo(ButtonWrapper);
