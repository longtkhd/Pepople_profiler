/**
 *
 * Container
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import './styles.less';

function ContainerBorder({ children }) {
  return (
    <div className="container-border">
      {children}
    </div>
  );
}

ContainerBorder.propTypes = {};

export default memo(ContainerBorder);
