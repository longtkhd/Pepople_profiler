import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import {
  makeSelectClosedJobsLoading,
} from 'containers/common_provider/get_closed_job/selectors';

import changeJobStatusAction from 'containers/common_provider/change_job_status/actions';
import {
  makeSelectChangeJobStatusLoading,
} from 'containers/common_provider/change_job_status/selectors';

import TableCustom from 'components/TableCustom/';
import FormInfoDetail from 'components/FormInfoDetail';
import { Button, Tag } from 'antd';
import { getUserInfo } from 'services/authentication';

import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';

const ClosedJob = (props) => {
  const {
    title,
    closedJobLoading,
    changeJobStatus,
    changeJobStatusLoading,
    dataSource,
  } = props;

  const userInfo = getUserInfo();
  const tag = { id: 4, key: 'closed', text:  <FormattedMessage {...messages.statusTag.closed} />, color: '#32363e' };

  const columnClosedJobs = [
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
      width: '20%',
      render: status => {
        return <Tag color={tag.color} className={tag.key}>{tag.text}</Tag>
      }
    },
    {
      title: <FormattedMessage {...messages.role} />,
      dataIndex: 'job_title',
      key: 'job_title',
      width: '20%',
    },
    {
      title: <FormattedMessage {...messages.shortlisted} />,
      dataIndex: 'candidate_count',
      key: 'candidate_count',
      width: '20%',
    },
    {
      title: <FormattedMessage {...globalMessages.actions} />,
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <div className={'table-action-wrapper'}>
          <Button type="default" onClick={() => reactiveJob(record)}>
            <FormattedMessage {...messages.reactive} />
          </Button>
        </div>
      ),
    },
  ];

  const reactiveJob = job => {
    const { agency_id } = userInfo;
    if (agency_id) {
      const params = {
        status: 1,
        job_id: [job.id]
      }
      changeJobStatus(agency_id, params);
    }
  }

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <FormInfoDetail title={title}>
      <TableCustom
        dataSource={dataSource}
        columns={columnClosedJobs}
        pagination={false}
        loading={closedJobLoading || changeJobStatusLoading}
      />
    </FormInfoDetail>
  );
};

ClosedJob.propTypes = {
  title: PropTypes.any.isRequired,
  dataSource: PropTypes.array,
  closedJobLoading: PropTypes.bool,
  changeJobStatus: PropTypes.func,
  changeJobStatusLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  closedJobLoading: makeSelectClosedJobsLoading(),
  changeJobStatusLoading: makeSelectChangeJobStatusLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    changeJobStatus: (agencyId, params) => dispatch(changeJobStatusAction(agencyId, params))
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClosedJob);
