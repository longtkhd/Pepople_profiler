/**
 *
 * SpinnerLoading
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import ClipLoader from "react-spinners/ClipLoader";
import './styles.less';

function SpinnerLoading({loading}) {
  return (
    <div className={`style-spin-wrapper`}>
        <div className={`style-spin`}>
          <ClipLoader size={50} color={`#3abcca`} loading={loading} />
        </div>
    </div>
  )
}

SpinnerLoading.propTypes = {};

export default memo(SpinnerLoading);
