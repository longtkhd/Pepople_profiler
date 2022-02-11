/**
 *
 * HighlightText
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

function HighlightText(props) {
  const { children } = props;
  return (
    <div className="color-primary">
      {children}
    </div>
  );
}

HighlightText.propTypes = {
  text: PropTypes.string
};

export default memo(HighlightText);
