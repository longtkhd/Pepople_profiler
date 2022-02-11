/**
 *
 * SpinnerPage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import PropagateLoader from "react-spinners/PropagateLoader";
import './styles.less';

function SpinnerPage() {
  return (
    <div className={`wrapper-spinner-page`}>
      <div className={`style-spin`}>
        <PropagateLoader size={15} color={`#3abcca`} loading={true} />
      </div>
    </div>
  )
}

SpinnerPage.propTypes = {};

export default memo(SpinnerPage);
