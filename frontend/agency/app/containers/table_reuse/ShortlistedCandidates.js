import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Row, Col, Input, Button, Popconfirm, Form } from 'antd';
import FormInfoDetail from 'components/FormInfoDetail';
import { PlusOutlined, FilePdfOutlined } from '@ant-design/icons';
import ButtonCustom from 'components/atoms/Button';
import MoreInfo from 'components/MoreInfo';
import Status from 'components/Status';
import PopConfirmCustom from 'components/PopConfirmCustom';
import { pushNotify } from 'utils/notify';
import InputEditCustom from 'components/InputEditCustom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectShortlistedCandidateJobLoading,
  makeSelectShortlistedCandidateJobResult,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/selectors';
import {
  getShortlistedCandidate,
  cleanUpShortlistedCandidate,
} from 'containers/common_provider/candidate_state/get_shortlisted_candidate_job/actions';

import {
  deleteCandidateDetail,
  cleanUpDeleteCandidate,
} from 'containers/common_provider/candidate_state/delete_candidate_in_list/actions';
import {
  editCandidateInfoDetail,
  cleanUpEditCandidate,
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/actions';
import {
  makeSelectDeleteCandidateResult,
  makeSelectDeleteCandididateLoad,
} from 'containers/common_provider/candidate_state/delete_candidate_in_list/selectors';
import {
  makeSelectEditCandidateResult,
  makeSelectEditCandidateLoad,
} from 'containers/common_provider/candidate_state/edit_candidate_in_list/selectors';
import './styles/shortlisted_candidates.less';
import NumberFormat from 'react-number-format';
import exportCandidatePdfAction, {
  clearExportPdfAction,
} from '../common_provider/export_candidate_report_pdf/actions';
import {
  makeSelectExportCandidateReportPdfError,
  makeSelectExportCandidateReportPdfLoading,
  makeSelectExportCandidateReportPdfResponse,
} from '../common_provider/export_candidate_report_pdf/selectors';
import CombinedCustom from 'components/CombinedCustom';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]?.trim(),
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      // console.log('valuesEdit>>',values);
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      // rules={[
      //   {
      //     pattern: /^[^\s]+(\s+[^\s]+)*$/,
      //     message: `${title} is not valid`,
      //   },
      //   {
      //     required: true,
      //     message: `${title} is required.`,
      //   },
      // ]}
      >
        <Input
          className={`ant-custom-input`}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const ShortlistedCandidates = props => {
  // console.log('props>> candidatels', props);
  const {
    history,
    jobDetail,
    shortlistedCandidateLoad,
    shortlistedCandidateResult,
    getShortlistedCandidate,
    cleanUpShortlistedCandidate,
    deleteCandidateDetail,
    cleanUpDeleteCandidate,
    deleteCandidateResult,
    deleteCandidateLoad,
    editCandidateResult,
    editCandidateLoad,
    editCandidateInfoDetail,
    exportCandidatePdfAction,
    exportResponse,
    exportError,
    exportLoading,
    cleanUpEditCandidate,
    clearExportPdfAction,
    jobType
  } = props;

  // console.log('editCandidateResult>', editCandidateResult);
  // console.log('editCandidateLoad>', editCandidateLoad);
  // console.log('shortlistedCandidateLoad>>',shortlistedCandidateLoad);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(false);

  const shortlistedCandidateList = useMemo(() => {
    return (
      shortlistedCandidateResult &&
      shortlistedCandidateResult.map(candidate => ({
        id: candidate?.id,
        key: candidate?.id,
        name: candidate?.candidate_name,
        status: candidate?.assessment_status || 'notinvitedyet',
        email: candidate?.candidate_email,
        position: candidate?.current_position,
        employer: candidate?.current_employer,
        exp: candidate?.exp_rem,
        notice: candidate?.notice_period,
      }))
    );
  }, [shortlistedCandidateResult]);
  // console.log('shortlistedCandidateResult>>',shortlistedCandidateResult);

  const handleExportCandidate = candidateId => {
    const params = { candidate_id: [candidateId], job_id: jobDetail?.id };
    exportCandidatePdfAction(params);
  };

  const handleExportToPdfAll = useCallback(() => {
    if (!shortlistedCandidateResult) return;
    const listId = shortlistedCandidateResult.map(cadidate => cadidate.id);
    const params = { candidate_id: listId, job_id: jobDetail?.id };
    exportCandidatePdfAction(params);
  }, [shortlistedCandidateResult]);
  useEffect(() => {
    return () => {
      cleanUpShortlistedCandidate();
      cleanUpDeleteCandidate();
      cleanUpEditCandidate();
      clearExportPdfAction();
    };
  }, []);

  useEffect(() => {
    if (deleteCandidateResult?.success) {
      pushNotify({
        type: 'success',
        message: 'Candidate deleted successfully',
      });
      setDeletePopup(false);
      cleanUpDeleteCandidate();
    }
  }, [deleteCandidateResult]);

  useEffect(() => {
    if (editCandidateResult?.success) {
      cleanUpEditCandidate();
      //pushNotify({
      //  type: 'open',
      //  message: 'Edit a candidate success',
      //});
    }
  }, [editCandidateResult]);

  useEffect(() => {
    if (exportResponse) {
      const fileURL = window.URL.createObjectURL(exportResponse?.data);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', exportResponse?.fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      clearExportPdfAction();
    }
  }, [exportResponse]);

  useEffect(() => {
    if (exportError) {
      pushNotify({
        type: 'warning',
        message: 'Export pdf faild.',
      });
    }
  }, [exportError]);

  useEffect(() => {
    if (jobDetail?.id) {
      getShortlistedCandidate(jobDetail?.id);
    }
  }, [jobDetail, deleteCandidateResult, editCandidateResult]);

  const handleDeleteCandidate = useCallback(
    candidateId => {
      deleteCandidateDetail(candidateId, jobDetail?.id);
    },
    [jobDetail],
  );

  const columnList = [
    {
      title: 'Actions',
      dataIndex: 'action',
      align: 'left',
      render: (text, record) => {
        // console.log('record.>', record);
        return (
          <>
            <Row
              // className={'table-action-wrapper'}
              gutter={[8, 8]}
              align="middle"
              justify="space-between"
            >
              <Col>
                <ActionType
                  type="manage"
                  onClick={() =>
                    // history.push(`/candidate-report/${record.id}`)
                    history.push({
                      pathname: `/candidate-report/${record.id}/${jobDetail?.id
                        }`,
                      state: {
                        jobId: jobDetail?.id,
                      },
                    })
                  }
                />
              </Col>
              <Col>
                <ActionType
                  onClick={() => handleExportCandidate(record.id)}
                  type="pdf"
                />
              </Col>
              <Col>
                <ActionType
                  onClick={() => {
                    setDeleteRecord(record);
                    setDeletePopup(true);
                  }}
                  type="delete"
                />
              </Col>
            </Row>
          </>
        );
      },
      width: '15%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      render: name => <div>{name ? name : '...'}</div>,
      width: '10%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      editable: true,
      render: email => <div>{email ? email : '...'}</div>,
      width: '13%',
    },
    {
      title: 'Current position',
      dataIndex: 'position',
      editable: true,
      render: position => <div>{position ? position : '...'}</div>,
      width: '15%',
    },
    {
      title: 'Current employer',
      dataIndex: 'employer',
      editable: true,
      render: employer => <div>{employer ? employer : '...'}</div>,
      width: '13%',
    },
    {
      title: 'Assesment status',
      dataIndex: 'status',
      render: status => {
        // console.log('status>>',status.replace(/\s/g, '').toLowerCase());
        return <Status type={status.replace(/\s/g, '').toLowerCase()} />;

        // if (!record?.position && !record?.employer) {
        //   return <Status type={'missing2'} />;
        // } else if (!record?.position || !record?.employer) {
        //   return <Status type={'missing'} />;
        // } else {
        //   return <Status type={'successful'} />;
        // }
      },
      // width: '10%'
    },
    {
      title: 'REM/RATE',
      dataIndex: 'exp',
      editable: true,
      render: exp => <div>
        {exp && jobDetail?.work_type === "Temp" ?
          <span>{exp}</span> :
          <NumberFormat
            className={`form-ant-input form-input-toggle custom__number`}
            placeholder=""
            prefix="AUD $"
            thousandSeparator={true}
            displayType={'text'}
            value={exp}></NumberFormat>}
      </div>,
      // width: '10%'
    },
    {
      title: 'Notice Period',
      dataIndex: 'notice',
      editable: true,
      render: notice => (
        <div style={{ display: 'block' }}>{notice ? notice : '...'}</div>
      ),
      // width: '10%'
    }
  ];

  const handleSave = row => {
    // console.log('Rows>>', row);
    const payload = {
      candidate_name: row?.name,
      current_position: row?.position,
      current_employer: row?.employer,
      candidate_email: row?.email,
      exp_rem: row?.exp,
      notice_period: row?.notice,
    };
    // console.log(`payload>>`,payload);
    editCandidateInfoDetail(row?.id, jobDetail?.id, payload);
    // editCandidateInfoDetail(row?.id,payload);
    // setValueEditRow({...valueEditRow, row});
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = columnList.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <>
      <CombinedCustom
        width={600}
        toggleModal={deletePopup}
        title={`Are you sure?`}
        content={`Are you sure you want to remove ${deleteRecord?.name ? `candidate ${deleteRecord?.name}` : 'this ?'
          }`}
        footer={[
          <Row gutter={[8, 8]} justify="center" align="middle">
            <Col>
              <ButtonCustom
                className="btn-default-outline btn-120-40"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                {`Cancel`}
              </ButtonCustom>
            </Col>
            <Col>
              <ButtonCustom
                className="btn-primary-gradient btn-120-40"
                onClick={() => handleDeleteCandidate(deleteRecord?.id)}
              >
                {`Remove`}
              </ButtonCustom>
            </Col>
          </Row>,
        ]}
      />
      <FormInfoDetail
        title={<FormattedMessage {...messages.shortlisted} />}
        actions={
          <Row className="action-group" gutter={[8, 8]}>
            <Col>
              {shortlistedCandidateList && shortlistedCandidateList.length > 0 && (
                <ButtonCustom
                  className="btn-default-outline"
                  onClick={handleExportToPdfAll}
                >
                  <FilePdfOutlined className="icon-btn" />
                  <FormattedMessage {...messages.exportPdf} />
                </ButtonCustom>
              )}
            </Col>
            <Col>
              <ButtonCustom
                onClick={() => history.push(`/create-new-job/${jobDetail?.id}`)}
                className="btn-primary-gradient"
              >
                <PlusOutlined className="icon-btn" />
                <FormattedMessage {...messages.addNewCandidate} />
              </ButtonCustom>
            </Col>
          </Row>
        }
      >
        <div className={`more-info-wrapper`}>
          <MoreInfo content={<FormattedMessage {...messages.moreInfo} />} />
        </div>
        <TableCustom
          {...props}
          components={components}
          rowClassName={() => 'editable-row'}
          // bordered
          scroll={{ y: 250, x: 1366 }}
          loading={shortlistedCandidateLoad || exportLoading}
          columns={columns}
          dataSource={shortlistedCandidateList}
          pagination={false}
          key={c => c.key}
        />
      </FormInfoDetail>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  shortlistedCandidateLoad: makeSelectShortlistedCandidateJobLoading(),
  shortlistedCandidateResult: makeSelectShortlistedCandidateJobResult(),
  deleteCandidateResult: makeSelectDeleteCandidateResult(),
  deleteCandidateLoad: makeSelectDeleteCandididateLoad(),
  editCandidateResult: makeSelectEditCandidateResult(),
  editCandidateLoad: makeSelectEditCandidateLoad(),
  exportResponse: makeSelectExportCandidateReportPdfResponse(),
  exportError: makeSelectExportCandidateReportPdfError(),
  exportLoading: makeSelectExportCandidateReportPdfLoading(),
});

const mapDispatchToProps = {
  getShortlistedCandidate,
  cleanUpShortlistedCandidate,
  deleteCandidateDetail,
  cleanUpDeleteCandidate,
  editCandidateInfoDetail,
  cleanUpEditCandidate,
  exportCandidatePdfAction,
  clearExportPdfAction,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ShortlistedCandidates);
