/**
 *
 * UploadFileDrop
 *
 */

import React, { memo, useCallback, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Upload, message } from 'antd';
const { Dragger } = Upload;
import Button from 'components/atoms/Button';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { UploadOutlined } from '@ant-design/icons';
import './styles.less';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { previewListCandidate } from 'containers/common_provider/candidate_state/upload_cv/actions';
import { makeSelectCandidatePreview } from 'containers/common_provider/candidate_state/upload_cv/selectors';
import CombinedCustom from 'components/CombinedCustom';
import ButtonCustom from 'components/atoms/Button';
import { Row, Col, } from 'antd';
function UploadFileDrop(props) {
  const { uploadFile, jobId, listCV, previewListCandidate } = props;
  // console.log('listCV>>',listCV);
  const [toggleModal, setToggleModal] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');

  const onCancel = () => {
    setToggleModal(false);
  };

  const dumbRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess();
    }, 0);
  };

  const propsStatic = {
    name: 'cv',
    multiple: true,
    fileList: listCV,
    // accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    beforeUpload: (file, fileList) => {
      const isFileTypes =
        file.type === 'application/pdf' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword';

      if (!isFileTypes) {
        fileList.shift();
        setToggleModal(true);
        setMsgTitle(`Oops, incorrect format`);
        setMsgContent(`This resume is an unsupported format. Please upload a DOC, DOCX, or PDF file.`);
        return false;
      }
    },
    customRequest: dumbRequest,
    onChange(info) {
      const { status } = info.file;

      if (status !== 'uploading') {
        // if (flag.current) {
        // console.log('info.fileList>>', info.fileList);
        // setFileList(info.fileList)
      }
      if (status === 'done') {
        previewListCandidate(info.fileList);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    showUploadList: false,
    // onRemove: (file) => console.log(`files>>`,file)
  };

  // console.log('fileList>>>',fileList);

  return (
    <>
      <CombinedCustom
        width={500}
        toggleModal={toggleModal}
        title={msgTitle}
        content={msgContent}
        footer={[
          <Row gutter={[8, 0]}>
            <Col>
              <ButtonCustom
                onClick={onCancel}
                className={`btn-default-outline w-120`}
              >
                {`OK`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <Dragger {...propsStatic}>
        <p className="ant-upload-drag-icon">{/* <InboxOutlined /> */}</p>
        <div className="ant-upload-text">
          <p>{`Drag & drop resumes or`}</p>
          {/* <p>{'or'}</p> */}
        </div>
        <Button className="ant-upload-hint btn-default-outline">
          <UploadOutlined className="icon-btn" />{' '}
          <span>{`Upload from computer`}</span>
        </Button>
      </Dragger>
    </>
  );
}

UploadFileDrop.propTypes = {};

const mapStateToProps = createStructuredSelector({
  listCV: makeSelectCandidatePreview(),
});

const mapDispatchToProps = {
  previewListCandidate,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(UploadFileDrop);
