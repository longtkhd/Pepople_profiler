/**
 *
 * RawHtml
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';


function RawHtml({ html }) {
  return (
    <>
      {ReactHtmlParser(html)}
    </>
  )
}

RawHtml.propTypes = {
  html: PropTypes.string.isRequired,
};

export default memo(RawHtml);
