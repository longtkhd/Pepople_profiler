/**
 *
 * ModalCustom
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Modal } from 'antd';
import './styles.less';
import CloseButton from 'components/CloseButton'


function ModalCustom(props) {

  if (props.type === 'RequestModal') {

    return (
      <>
        <div onClick={props.showModal}>
          {props.btnName}
        </div>
        <Modal
          {...props}
          visible={props.toggleModal}
          title={props.title}
          onOk={props.handleOk}
          onCancel={props.handleCancel}
          closable={true}
          closeIcon={<CloseButton />}
          className="modal-custom-request"
          centered
        >
          {props.children}
        </Modal>
      </>
    );

  } else {
    return (
      <>
        <div onClick={props.showModal}>
          {props.btnName}
        </div>
        <Modal
          {...props}
          visible={props.toggleModal}
          title={props.title}
          onOk={props.handleOk}
          onCancel={props.handleCancel}
          closable={false}
          className="modal-custom"
          centered
        >
          {props.children}
        </Modal>
      </>
    );

  }


}

ModalCustom.propTypes = {};

export default memo(ModalCustom);
