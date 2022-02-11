/**
 *
 * ToggleSwitch
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Switch from 'react-ios-switch';
// checked={undefined}
// className={undefined}
// disabled={undefined}
// handleColor="white"
// name={undefined}
// offColor="white"
// onChange={() => {}}
// onColor="rgb(76, 217, 100)"
// pendingOffColor={undefined}
// pendingOnColor={undefined}
// readOnly={undefined}
// style={undefined}
function ToggleSwitch(props) {
  return (
    <Switch  {...props} handleColor="white" offColor="white" onColor="rgb(76, 217, 100)" />
  );
}

ToggleSwitch.propTypes = {};

export default memo(ToggleSwitch);
