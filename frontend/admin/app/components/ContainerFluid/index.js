/**
 *
 * ContainerFluid
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import './styles.less';

function ContainerFluid({ children }) {
  return (
    <div className="container-fluid">
      {children}
    </div>
  );
}

ContainerFluid.propTypes = {};

export default memo(ContainerFluid);
