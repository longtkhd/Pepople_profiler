/**
 *
 * Button
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Button } from 'antd';
import './styles.less';

function ButtonWrapper(props) {
  return props.case === 'static' ? (
    <div onClick={props.onClick} {...props} className={`btn ${props.className}`} style={{ ...props.styles }}>
      {props.children}
    </div>
  ) : (
      <button onClick={props.onClick} {...props} className={`btn ${props.className}`}>
        {props.children}
      </button>
    )
}

export const ButtonStyles = (props) => {
  return (
    <div onClick={props.onClick} {...props} className={`btn  ${props.className}`}>
      {props.children}
    </div>
  )
}

ButtonWrapper.propTypes = {};

export default memo(ButtonWrapper);
