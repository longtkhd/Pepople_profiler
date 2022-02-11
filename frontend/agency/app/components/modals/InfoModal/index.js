/**
 *
 * InfoModal
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import './styles.less';

function InfoModal(props) {
  const { icon, title, content, okText, onOK } = props;
  Modal.info({
    centered: true,
    className: "info-modal",
    icon,
    title,
    content,
    okText,
    onOk: onOK
  });
}

InfoModal.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.any.isRequired,
  content: PropTypes.any.isRequired,
  okText: PropTypes.string,
  onOK: PropTypes.func,
};

export default memo(InfoModal);
