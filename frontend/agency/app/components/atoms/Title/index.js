/**
 *
 * Title
 *
 */

import React, { memo } from 'react';
import './styles.less';

function Title(props) {
  const { children } = props;
  return (
    
    <div className= {`title ${props.className}`} style={ props.styles }>
      {children}
    </div>
  );
}

Title.propTypes = {};

export default memo(Title);
