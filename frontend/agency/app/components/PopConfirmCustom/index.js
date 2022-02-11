/**
 *
 * PopConfirmCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Popconfirm } from 'antd';
import './styles.less';

function PopConfirmCustom(props) {
  return (
    <div className={`wrapper-popconfirm`}>
      <Popconfirm
        title={props.title}
        onConfirm={props.onConfirm}
        onCancel={props.onCancel}
        okText={props.okText}
        cancelText={props.cancelText}
      >
        {props.children}
      </Popconfirm>
    </div>
  );
}

PopConfirmCustom.propTypes = {};

export default memo(PopConfirmCustom);
