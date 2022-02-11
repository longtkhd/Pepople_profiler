/**
 *
 * CombinedCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import ModalCustom from 'components/ModalCustom';
import messages from './messages';
import CombinedIcon from 'images/combined/combined-shape@3x.png';
import SuccessIcon from 'images/icons/successful.png';

import './styles.less';

function CombinedCustom(props) {
  return (
    <div className={`wrapper-combined`}>
      <ModalCustom
        wrapClassName={`custom-modal-combined`}
        {...props}
        title={false}
        footer={false}
      >
        <div className="combined">
          <div className={`combined-head`}>
            <img className={`combined-head-img`} src={props?.isSuccess ? SuccessIcon : CombinedIcon} alt={``} />
          </div>
          <div className="combined-body">
            <div className={`combined-body-title`}>
              <h3>{props.title}</h3>
            </div>
            <div className={`combined-body-content`}>
              <p>{props.content}</p>
            </div>
          </div>
          <div className="combined-footer">{props?.footer[0]}</div>
        </div>
      </ModalCustom>
    </div>
  );
}

CombinedCustom.propTypes = {};

export default memo(CombinedCustom);
