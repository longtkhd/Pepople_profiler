/**
 *
 * RegisterFooter
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom'
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function RegisterFooter() {
  return (
    <div className="helper-links">
      <span>
        <FormattedMessage {...messages.existingUser} />
      </span>
      <Link to='login' className="color-primary bold-text">
        <FormattedMessage {...messages.loginHere} />
      </Link>|
      <Link to='#'>
       <FormattedMessage {...messages.termOfUse} /> 
      </Link>|
      <Link to='#'>
       <FormattedMessage {...messages.privacy} /> 
      </Link>
    </div>
  );
}

RegisterFooter.propTypes = {};

export default memo(RegisterFooter);
