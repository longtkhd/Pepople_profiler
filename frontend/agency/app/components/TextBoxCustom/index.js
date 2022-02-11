/**
 *
 * TextBoxCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function TextBoxCustom(props) {
  // const [field, meta] = useField(props);
  // console.log('field>>>',field);
  return (
    <div className={`wrapper-textbox`}>
      <div className="textbox-title">
        {props.titleField[0]}
      </div>
      <div className="textbox-content">
        {props.contentField[0]}
      </div>
      {/* <FormattedMessage {...messages.header} /> */}
    </div>
  );
}

TextBoxCustom.propTypes = {};

export default memo(TextBoxCustom);
