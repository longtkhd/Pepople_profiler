/**
 *
 * MoreInfo
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import IconCustom from 'components/IconCustom';
import IconMoreInfo from 'images/icons/group-6@3x.png';
import './styles.less';

import messages from './messages';
import { FormattedMessage } from 'react-intl';

function MoreInfo({ content , ...rest }) {
  return (
    <div {...rest} className={`more-info-block`}>
      <IconCustom src={IconMoreInfo} alt={<FormattedMessage  {...messages.moreInfo} />} />
      <div className={`more-infor-content`}>
        {content}
      </div>
    </div>
  );
}

MoreInfo.propTypes = {};

export default memo(MoreInfo);
