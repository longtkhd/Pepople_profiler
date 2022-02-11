/**
 *
 * UploadFileDrop
 *
 */

import React, { memo, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Upload, message } from 'antd';
const { Dragger } = Upload;
import Button from 'components/atoms/Button';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { UploadOutlined } from '@ant-design/icons';
import './styles.less';

function UploadFileDrop(props) {

  const { uploadFile, jobId } = props;

  const requestUpload = useCallback( async ({  onSuccess, onError, file, onProgress }) => {
    console.log(`file`,file);
    let formData = new FormData();
    formData.append('cv',file);
    try {
      const res = await uploadFile(jobId,formData, {
        onUploadProgress: e => {
          onProgress({ percent: (e.loaded / e.total) * 100 });
        }
      });
      console.log('result>>',res);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  },[ jobId, uploadFile ]);
  const propsStatic = {
    name: 'cv',
    multiple: true,
    customRequest: requestUpload,
    // action: (file) => {
    //   console.log('file>>',file);
    // },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
        // props.upload(,info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Dragger {...propsStatic}>
      <p className="ant-upload-drag-icon">{/* <InboxOutlined /> */}</p>
      <div className="ant-upload-text">
        <p>{`Drag & drop resumes or`}</p>
        {/* <p>{'or'}</p> */}
      </div>
      <Button className="ant-upload-hint btn-default-outline">
        <UploadOutlined className="icon-btn" /> <span>{`Upload from computer`}</span>
      </Button>
    </Dragger>
  );
}

UploadFileDrop.propTypes = {};

export default memo(UploadFileDrop);
