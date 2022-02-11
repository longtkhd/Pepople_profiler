/**
 *
 * SubscriptionPlanAlertModal
 *
 */

import { memo } from 'react';
import { Modal } from 'antd';
import './styles.less'

function ConfirmModal(props) {
  const {
    onOk,
    onCancel,
  } = props;

  Modal.confirm({
    ...props,
    centered: true,
    className: 'confirm-modal',
    onOk: onOk,
    onCancel: onCancel,
  });
}
export default memo(ConfirmModal);
