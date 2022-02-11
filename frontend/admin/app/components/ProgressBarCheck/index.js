/**
 *
 * ProgressBarCheck
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Form, Input, Button, Progress } from 'antd';
import { inRange } from 'lodash';


import './styles.less';

function ProgressBarCheck(props) {

  const { quality } = props;

  // console.log(quality)
  // const [passwordQuality, setPasswordQuality] = useState(0);
  const formatCheckPassword = (percent, successPercent) => {
    if (inRange(percent, 1, 50)) {
      return "Too Weak";
    } else if (inRange(percent, 50, 80)) {
      return "Average";
    } else if (inRange(percent, 80, 100)) {
      return "Strong";
    } else if (percent == 100) {
      return "Very Strong";
    }
  }

  const getStrokeColor = (percent) => {
    if (inRange(percent, 0, 50)) {
      return "#f54e60";
    } else if (inRange(percent, 50, 80)) {
      return "#ffa800";
    } else if (inRange(percent, 80, 100)) {
      return "#3abcca";
    }
  }

  return (

    quality ? (
      <Progress size="small" className="password-progress" percent={quality} format={formatCheckPassword} strokeColor={getStrokeColor(quality)} />
    ) : null

  )
}

ProgressBarCheck.propTypes = {};

export default memo(ProgressBarCheck);
