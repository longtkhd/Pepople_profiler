/**
 *
 * CandidateReportDocuments
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectDocumentsError,
  makeSelectDocumentsLoading,
  makeSelectDocumentsSuccess,
  makeSelectUploadDocumentsSuccess,
  makeSelectRemoveDocumentSuccess,
  makeSelectDownloadDocumentSuccess,
  makeSelectUpdatePublicDocumentSuccess,
  makeSelectDownloadDocumentLoading,
  makeSelectDownloadDocumentError,
} from '../common_provider/candidate_state/candidate_document/selectors';

import {
  getDocumentsAction,
  uploadDocumentAction,
  removeDocumentsAction,
  downloadDocumentsAction,
  updatePublicDocumentsAction,
  cleanAllStateDocument,
} from '../common_provider/candidate_state/candidate_document/actions';
import reducer from './reducer';
import messages from './messages';
import ButtonCustom from 'components/atoms/Button';
import FormInfoDetail from 'components/FormInfoDetail';
import { Row, Col, Modal, Button, message, Form } from 'antd';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import MoreInfo from 'components/MoreInfo';
import CandidateReportNavigate from 'containers/candidate_report_navigate';
import './styles.less';

import Dragger from 'antd/lib/upload/Dragger';
import { FileOutlined, PlusOutlined } from '@ant-design/icons';
import { openNotification } from 'utils/notification';
import SpinnerLoading from 'components/SpinnerLoading';
import { ContentModal } from '../../components/modals/ContentModal';
export function CandidateReportDocuments(props) {
  useInjectReducer({ key: 'candidateReportDocuments', reducer });

  const {
    candidateInfo,
    jobType,
    loading,
    documents,
    error,
    getDocumentsAction,
    uploadDocumentAction,
    uploaded,
    removed,
    removeDocumentsAction,
    loadingDownload,
    errorDownload,
    download,
    downloadDocumentsAction,
    updated,
    updatePublicDocumentsAction,
    cleanAllStateDocument,
    jobId,
    history,
  } = props;

  const [form] = Form.useForm();

  const [showModalDocument, setShowModalDocument] = useState(false);
  const [defaultSelectedRows, setDefaultSelectedRows] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isOnchangeSelect, setIsOnchangeSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleChangeDocumentFile = info => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleCancel = () => {
    toggleModal();
  };

  const toggleModal = () => {
    setShowModalDocument(!showModalDocument);
  };

  const handleUploadFile = value => {
    const formData = new FormData();
    const files = value?.files.fileList;
    for (const file of files) {
      formData.append('file', file.originFileObj, file.name);
    }
    uploadDocumentAction(candidateInfo?.id, formData);
    toggleModal();
  };

  const handleRemoveDoc = docId => {
    Modal.confirm({
      title: false,
      icon: false,
      centered: true,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.confirmRemoveTitle} />}
          message={<FormattedMessage {...messages.confirmRemoveMessage} />}
        />
      ),
      okText: <FormattedMessage {...messages.buttonRemove} />,
      onOk() {
        removeDocumentsAction(candidateInfo?.id, docId);
      },
    });
  };

  const handleDownloadDoc = doc => {
    downloadDocumentsAction(candidateInfo?.id, doc);
  };

  const handleUpdatePublicDoc = () => {
    if (!candidateInfo?.id) return;
    updatePublicDocumentsAction(candidateInfo?.id, {
      doc_ids: selectedRowKeys?.selectedRowKeys,
    });
  };

  const handleChangePage = useCallback(async currentPage => {
    setCurrent(currentPage);
    await getDocumentsAction(candidateInfo?.id, {
      params: {
        page: currentPage,
        size: pageSize,
      },
    });
  }, []);

  useEffect(() => {
    setCurrent(1);
    return () => {
      cleanAllStateDocument();
    };
  }, []);

  useEffect(() => {
    if (candidateInfo?.id) {
      getDocumentsAction(candidateInfo?.id, {
        params: {
          page: current,
          size: pageSize,
        },
      });
    }
  }, [candidateInfo?.id]);

  useEffect(() => {
    if (documents) {
      const defaultSelect = documents?.documents
        .filter(doc => doc.is_public)
        .map(doc => doc.id);
      setDefaultSelectedRows(defaultSelect);
      setTotal(documents?.total);
    }
  }, [documents]);

  useEffect(() => {
    let message;
    if (uploaded) message = <FormattedMessage {...messages.uploadSuccess} />;
    if (removed) message = <FormattedMessage {...messages.removeSuccess} />;
    if (updated) {
      message = <FormattedMessage {...messages.shareSuccess} />;
      setIsOnchangeSelect(false);
    }
    if (message) {
      openNotification('success', message);
      getDocumentsAction(candidateInfo?.id, {
        params: {
          page: current,
          size: pageSize,
        },
      });
    }
  }, [removed, uploaded, updated]);

  useEffect(() => {
    if (download) {
      const fileURL = window.URL.createObjectURL(download?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', download?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      getDocumentsAction(candidateInfo?.id, {
        params: {
          page: current,
          size: pageSize,
        },
      });
    }
  }, [download]);

  useEffect(() => {
    const err = error || errorDownload;
    if (err) {
      openNotification('error', error?.message || error);
    }
  }, [error]);

  useEffect(() => {
    let isLoading = loading || loadingDownload;
    setIsLoading(isLoading);
  }, [loading, loadingDownload]);

  const columns = [
    {
      title: <FormattedMessage {...messages.columnDocumentName} />,
      dataIndex: 'file_name',
    },
    {
      title: <FormattedMessage {...messages.columnUploadDate} />,
      dataIndex: 'created_at',
      render: (_, record) => {
        return <span>{moment(record?.created_at).format('DD MMM YYYY')}</span>;
      },
    },
    {
      title: 'actions',
      render: (_, record) => {
        return (
          <Row gutter={[8, 8]}>
            <Col>
              <ActionType
                type="download"
                onClick={() => handleDownloadDoc(record)}
              />
            </Col>
            <Col>
              <ActionType
                type="remove"
                onClick={() => handleRemoveDoc(record.id)}
              />
            </Col>
          </Row>
        );
      },
    },
  ];

  const rowSelection = {
    hideSelectAll: true,
    columnTitle: <FormattedMessage {...messages.columnShare} />,
    selectedRowKeys: defaultSelectedRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys({ selectedRowKeys });
      setDefaultSelectedRows(selectedRowKeys);
      setIsOnchangeSelect(true);
    },
  };

  if (isLoading) return <SpinnerLoading loading={loading} />;

  return (
    <FormInfoDetail
      title={<FormattedMessage {...messages.titleForm} />}
      className={`wrapper-candidate-document`}
      actions={
        <Row className="action-group" gutter={[8, 8]}>
          <Col>
            {isOnchangeSelect && (
              <ButtonCustom
                case="static"
                onClick={handleUpdatePublicDoc}
                className="btn-default-outline"
              >
                <i className="action-icon far fa-save" />
                <FormattedMessage {...messages.buttonSave} />
              </ButtonCustom>
            )}
          </Col>
          <Col>
            <ButtonCustom
              case="static"
              className="btn-primary-gradient"
              onClick={toggleModal}
            >
              <PlusOutlined className={`btn-icon`} />
              <FormattedMessage {...messages.buttonUpload} />
            </ButtonCustom>
          </Col>
        </Row>
      }
      case="use-form"
    >
      <MoreInfo content={<FormattedMessage {...messages.notiShare} />} />
      <div className={`wrapper-table-document`}>
        <TableCustom
          columns={columns}
          dataSource={documents?.documents}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          paginateStyle={`paginate-custom-flex-end`}
          paginate={true}
          pagination={false}
          paginateOptions={{
            current: current,
            defaultPageSize: pageSize,
            total: total,
            onChange: handleChangePage,
          }}
        />
      </div>
      <CandidateReportNavigate
        history={history}
        candidateId={candidateInfo?.id}
        jobId={jobId}
        jobType={jobType}
      />

      <Modal
        className="modal-upload-document"
        centered
        visible={showModalDocument}
        onCancel={handleCancel}
        title={<FormattedMessage {...messages.titleModal} />}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            <FormattedMessage {...messages.buttonModalUpload} />
          </Button>,
        ]}
      >
        <Form
          className="upload-container"
          form={form}
          onFinish={values => {
            handleUploadFile(values);
            form.resetFields();
          }}
        >
          <Form.Item
            name="files"
            rules={[
              {
                required: true,
                message: 'File is required',
              },
            ]}
          >
            <Dragger
              multiple={true}
              showUploadList={true}
              onChange={info => handleChangeDocumentFile(info)}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess('ok');
                }, 0);
              }}
            >
              <div style={{ fontSize: '22px' }}>
                <FileOutlined
                  style={{ marginRight: '5px', color: '#32363e' }}
                />
                <span>
                  <FormattedMessage {...messages.dropText} />
                </span>
              </div>
              <span style={{ margin: '20px 0px', fontSize: '16px' }}>
                <FormattedMessage {...messages.modalOrText} />
              </span>
              <Button type="default" style={{ fontSize: '14px' }}>
                <FormattedMessage {...messages.modalButtonSelect} />
              </Button>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </FormInfoDetail>
  );
}

CandidateReportDocuments.propTypes = {
  candidateInfo: PropTypes.object.isRequired,
  documents: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.object,
  uploaded: PropTypes.object,
  removed: PropTypes.object,
  download: PropTypes.object,
  updated: PropTypes.bool,
  getDocumentsAction: PropTypes.func,
  uploadDocumentAction: PropTypes.func,
  removeDocumentsAction: PropTypes.func,
  downloadDocumentsAction: PropTypes.func,
  updatePublicDocumentsAction: PropTypes.func,
  cleanAllStateDocument: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  documents: makeSelectDocumentsSuccess(),
  loading: makeSelectDocumentsLoading(),
  error: makeSelectDocumentsError(),
  uploaded: makeSelectUploadDocumentsSuccess(),
  removed: makeSelectRemoveDocumentSuccess(),
  download: makeSelectDownloadDocumentSuccess(),
  loadingDownload: makeSelectDownloadDocumentLoading(),
  errorDownload: makeSelectDownloadDocumentError(),
  updated: makeSelectUpdatePublicDocumentSuccess(),
});

const mapDispatchToProps = {
  getDocumentsAction,
  uploadDocumentAction,
  removeDocumentsAction,
  downloadDocumentsAction,
  updatePublicDocumentsAction,
  cleanAllStateDocument,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CandidateReportDocuments);
