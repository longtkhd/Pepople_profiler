import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectAssignRecruiterLoading,
  makeSelectAssignRecruiterResponse,
  makeSelectAssignRecruiterError,
} from './selectors';
import reducer from './reducer';
import assignRecruiterToJob from './actions';
import {
  makeSelectOpenJobsLoading,
} from 'containers/common_provider/get_open_job/selectors';
import changeJobStatusAction from 'containers/common_provider/change_job_status/actions';
import {
  makeSelectChangeJobStatusLoading,
} from 'containers/common_provider/change_job_status/selectors';

import TableCustom from 'components/TableCustom';
import { Button, Row, Col, Tag } from 'antd';
import { EditOutlined, UserOutlined, LockOutlined, FilePdfOutlined, EyeOutlined } from '@ant-design/icons'

import { getUserInfo } from 'services/authentication';
import FormInfoDetail from 'components/FormInfoDetail';
import { openNotification } from 'utils/notification';
import SelectRecruiterModal from 'components/modals/SelectRecruiterModal';
import './styles.less';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import { CONFIG } from 'constants/config';

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
  } = props;

  const [editMode, setEditMode] = useState(false);
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const userInfo = getUserInfo();

  const closeRole = job => {
    const { agency_id } = userInfo;
    if (agency_id) {
      const params = {
        status: 6,
        job_id: [job.id]
      }
      changeJobStatus(agency_id, params);
    }
  }

  const tags = [
    { id: 1, key: 'progress', text: <FormattedMessage {...messages.statusTag.progress} />, color: '#fff3e0' },
    { id: 2, key: 'submitted', text: <FormattedMessage {...messages.statusTag.submitted} />, color: '#c9f7f4' },
    { id: 3, key: 'received', text: <FormattedMessage {...messages.statusTag.received} />, color: '#ffe2e6' },
  ]

  const columnOpenJobs = [
    {
      title: <FormattedMessage {...messages.businessName} />,
      dataIndex: 'person_in_charge',
      key: 'person_in_charge',
      width: '20%',
    },
    {
      title: <FormattedMessage {...messages.status} />,
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: status => {
        const tag = tags.find(tag => tag.key === status);
        return tag ? <Tag color={tag.color} className={tag.key}>{tag.text}</Tag> : status
      }
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
      render: type => {
        const workType = CONFIG.WORK_TYPES.find(wt => wt.id === type);
        return workType?.name;
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
        <div className={'table-action-wrapper'}>
          <div className="action-item color-red" onClick={() => closeRole(record)}>
            <LockOutlined /> <FormattedMessage {...messages.closeRole} />
          </div>
          <div className="ml-15 action-item color-primary">
            <EyeOutlined /> <FormattedMessage {...globalMessages.view} />
          </div>
          <div className="ml-15 action-item color-orange">
            <FilePdfOutlined /> <FormattedMessage {...globalMessages.pdf} />
          </div>
        </div>
      ),
    },
  ];

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const showAssignTo = () => {
    setShowRecruiterModal(true);
  }

  const onSelectRecruiter = recruiter => {
    setSelectedRecruiter(recruiter);
  }

  const onDoneAssign = () => {
    // TODO: assign selected recruiter to job
    const params = {
      assign_user: selectedRecruiter.id,
      job_id: selectedRowKeys,
    }
    assignRecruiter(params);
    setEditMode(false);
  }

  const onCloseModal = () => {
    setShowRecruiterModal(false);
  }

  useEffect(() => {
    if (assignRecruiterResponse?.success) {
      openNotification('success', <FormattedMessage {...messages.assignRecruiterSuccess} />);
    }
    return () => {}
  }, [assignRecruiterResponse])

  useEffect(() => {
    if (assignRecruiterError) {
      openNotification('error', assignRecruiterError.message);
    }
    return () => {}
  }, [assignRecruiterError])

  useEffect(() => {
    return () => {}
  }, [])

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
                    className="mr-10 w-150"
                    onClick={onDoneAssign}
                    disabled={selectedRowKeys.length == 0 || !selectedRecruiter}
                  >
                    <FormattedMessage {...globalMessages.done} />
                  </Button>
                  <Button
                    type="default"
                    className="w-150"
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
                  icon={<EditOutlined />}
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
        rowSelection={editMode? rowSelection : null}
        dataSource={dataSource}
        columns={columnOpenJobs}
        pagination={false}
        loading={openJobLoading || changeJobStatusLoading || assignRecruiterLoading}
      />
      <SelectRecruiterModal 
        visible={showRecruiterModal} 
        closeModal={onCloseModal}
        selectRecruiter={onSelectRecruiter}
      />
    </FormInfoDetail>
  );
};

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
};

const mapStateToProps = createStructuredSelector({
  openJobLoading: makeSelectOpenJobsLoading(),
  changeJobStatusLoading: makeSelectChangeJobStatusLoading(),
  assignRecruiterLoading: makeSelectAssignRecruiterLoading(),
  assignRecruiterError: makeSelectAssignRecruiterError(),
  assignRecruiterResponse: makeSelectAssignRecruiterResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    changeJobStatus: (agencyId, params) => dispatch(changeJobStatusAction(agencyId, params)),
    assignRecruiter: (params) => dispatch(assignRecruiterToJob(params)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OpenJob);