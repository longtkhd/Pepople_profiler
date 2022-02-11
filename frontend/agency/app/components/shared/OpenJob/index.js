import React, { memo, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import Status from 'components/Status';
import {
  makeSelectAssignRecruiterLoading,
  makeSelectAssignRecruiterResponse,
  makeSelectAssignRecruiterError,
} from './selectors';
import reducer from './reducer';
import assignRecruiterToJob from './actions';
import ActionType from 'components/TableCustom/ActionType';
import { makeSelectOpenJobsLoading } from 'containers/common_provider/get_open_job/selectors';
import changeJobStatusAction from 'containers/common_provider/change_job_status/actions';
import {
  makeSelectChangeJobStatusLoading,
  makeSelectChangeJobStatusResponse,
} from 'containers/common_provider/change_job_status/selectors';

import TableCustom from 'components/TableCustom';
import { Button, Row, Col, Tag, Modal } from 'antd';
import {
  EditOutlined,
  UserOutlined,
  LockOutlined,
  FilePdfOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import { getUserInfo } from 'services/authentication';
import FormInfoDetail from 'components/FormInfoDetail';
import { openNotification } from 'utils/notification';
import SelectRecruiterModal from 'components/modals/SelectRecruiterModal';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import { CONFIG } from 'constants/config';
import { ContentModal } from '../../modals/ContentModal'

function OpenJob(props) {
  useInjectReducer({ key: 'openJob', reducer });
  const {
    title,
    editable,
    openJobLoading,
    changeJobStatus,
    changeJobStatusLoading,
    dataSource,
    assignRecruiter,
    assignRecruiterLoading,
    assignRecruiterError,
    assignRecruiterResponse,
    history,
    totals,
    changeJobStatusResponse,
    onAssignRecruiterSuccess,
    handleSearch,
  } = props;

  const [editMode, setEditMode] = useState(false);
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSizes, setPageSize] = useState(10);

  const userInfo = getUserInfo();

  const handleSetLast = () => {
    const lastPage = parseInt(totals / pageSizes) + 1;
    setCurrent(lastPage);
    props.handleGetPanigationData(pageSizes, lastPage);
  };
  const handleSetFirst = () => {
    setCurrent(1);
    props.handleGetPanigationData(pageSizes, 1);
  };

  const handConfirmCloseJob = record => {
    Modal.confirm({
      centered: true,
      title: false,
      icon: false,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.closeModalTitle} />}
          message={<FormattedMessage {...messages.closeModalContent} />}
        />
      ),
      okText: <FormattedMessage {...messages.closeModalButton} />,
      onOk: function() {
        closeRole(record);
      },
    });
  };

  const closeRole = job => {
    const { agency_id } = userInfo;
    if (agency_id) {
      const params = {
        status: 6,
        job_id: [job.id],
      };
      changeJobStatus(agency_id, params);
    }
  };

  const columnOpenJobs = [
    {
      title: <FormattedMessage {...messages.personInCharge} />,
      dataIndex: 'person_in_charge',
      key: 'person_in_charge',
    },
    {
      title: <FormattedMessage {...messages.businessName} />,
      dataIndex: 'business_name',
      key: 'business_name',
    },
    {
      title: <FormattedMessage {...messages.status} />,
      dataIndex: 'display_status',
      key: 'display_status',
      render: status => <Status type={status} />,
    },
    {
      title: <FormattedMessage {...messages.role} />,
      dataIndex: 'job_title',
      key: 'job_title',
      width: '15%',
    },
    {
      title: <FormattedMessage {...messages.workType} />,
      dataIndex: 'work_type',
      key: 'work_type',
      width: '15%',
      render: work_type => {
        if (work_type === "Permanent") return <span>Permanent / FTC</span>
        else if (work_type === "Contract") return <span>Executive Search</span>
        else if (work_type === "Temp") return <span>Temp</span>
      }
    },
    {
      title: <FormattedMessage {...messages.shortlisted} />,
      dataIndex: 'candidate_count',
      key: 'candidate_count',
      width: '15%',
    },
    {
      title: <FormattedMessage {...globalMessages.actions} />,
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType
              onClick={() => {
                handConfirmCloseJob(record);
              }}
              type="closeRole"
            />
          </Col>
          <Col>
            <ActionType
              type="view"
              onClick={() => {
                history.push(`/job-dashboard/${record.id}`);
              }}
            />
          </Col>
          <Col>
            <ActionType type="pdf" />
          </Col>
        </Row>
      ),
    },
  ];

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showAssignTo = () => {
    setShowRecruiterModal(true);
  };

  const onSelectRecruiter = recruiter => {
    setSelectedRecruiter(recruiter);
  };

  const onDoneAssign = () => {
    const params = {
      assign_user: selectedRecruiter.id,
      job_id: selectedRowKeys,
    };
    assignRecruiter(params);
    setEditMode(false);
  };

  const onCloseModal = () => {
    setShowRecruiterModal(false);
  };

  useEffect(() => {
    if (assignRecruiterResponse?.success) {
      openNotification(
        'success',
        <FormattedMessage {...messages.assignRecruiterSuccess} />,
      );
      if (onAssignRecruiterSuccess) {
        onAssignRecruiterSuccess();
      }
    }
    return () => {};
  }, [assignRecruiterResponse]);

  useEffect(() => {
    if (assignRecruiterError) {
      openNotification('error', assignRecruiterError.message);
    }
    return () => {};
  }, [assignRecruiterError]);

  useEffect(() => {
    if (dataSource.length == 0 && current != 1) {
      props.handleGetPanigationData(pageSizes, current - 1);
      setCurrent(current - 1);
    }
    return () => {};
  }, [dataSource]);

  const handleChangePage = useCallback(async (currentPage, pageSize) => {
    setCurrent(currentPage);
    setPageSize(pageSize);
    props.handleGetPanigationData(pageSize, currentPage);
  }, []);

  const onSearch = useCallback(async value => {
    handleSearch(value, current, pageSizes);
  });

  return (
    <FormInfoDetail
      title={title}
      actions={
        editable ? (
          <Row flex="flex" justify="center" align="middle">
            <Col>
              {editMode ? (
                <>
                  <Button
                    type="primary"
                    className="mr-10 w-140"
                    onClick={onDoneAssign}
                    disabled={selectedRowKeys.length == 0 || !selectedRecruiter}
                  >
                    <FormattedMessage {...globalMessages.done} />
                  </Button>
                  <Button
                    type="default"
                    className="w-140"
                    disabled={selectedRowKeys.length == 0}
                    icon={<UserOutlined />}
                    onClick={showAssignTo}
                  >
                    <FormattedMessage {...messages.assignTo} />
                  </Button>
                </>
              ) : (
                <Button
                  type="default"
                  icon={<i className="action-icon fas fa-edit" />}
                  onClick={() => setEditMode(true)}
                >
                  <FormattedMessage {...globalMessages.edit} />
                </Button>
              )}
            </Col>
          </Row>
        ) : null
      }
    >
      <TableCustom
        searchBox={true}
        handleSearchBox={onSearch}
        rowSelection={editMode ? rowSelection : null}
        dataSource={dataSource}
        columns={columnOpenJobs}
        pagination={false}
        loading={
          openJobLoading || changeJobStatusLoading || assignRecruiterLoading
        }
        scroll={{
          x: 1024,
        }}
        paginate={true}
        paginateStyle={`paginate-custom-style`}
        paginateOptions={{
          total: totals,
          current: current,
          onChange: handleChangePage,
        }}
        isShowJump={true}
        setCurrentCustom={() => handleSetLast()}
        setCurrentFirst={() => handleSetFirst()}
      />
      {editable ? (
        <SelectRecruiterModal
          visible={showRecruiterModal}
          closeModal={onCloseModal}
          selectRecruiter={onSelectRecruiter}
        />
      ) : null}
    </FormInfoDetail>
  );
}

OpenJob.propTypes = {
  title: PropTypes.any.isRequired,
  editable: PropTypes.bool.isRequired,
  dataSource: PropTypes.array,
  openJobLoading: PropTypes.bool,
  changeJobStatus: PropTypes.func,
  changeJobStatusLoading: PropTypes.bool,
  assignRecruiter: PropTypes.func,
  assignRecruiterLoading: PropTypes.bool,
  assignRecruiterError: PropTypes.object,
  assignRecruiterResponse: PropTypes.object,
  onAssignRecruiterSuccess: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  openJobLoading: makeSelectOpenJobsLoading(),
  changeJobStatusLoading: makeSelectChangeJobStatusLoading(),
  assignRecruiterLoading: makeSelectAssignRecruiterLoading(),
  assignRecruiterError: makeSelectAssignRecruiterError(),
  assignRecruiterResponse: makeSelectAssignRecruiterResponse(),
  changeJobStatusResponse: makeSelectChangeJobStatusResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    changeJobStatus: (agencyId, params) =>
      dispatch(changeJobStatusAction(agencyId, params)),
    assignRecruiter: params => dispatch(assignRecruiterToJob(params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OpenJob);
