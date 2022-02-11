import React, { memo, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import FormInfoDetail from 'components/FormInfoDetail';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import { getJobs } from 'containers/common_provider/create_job_state/get_job/actions';
import { createStructuredSelector } from 'reselect';
import makeSelectJobListState, {
  makeSelectJobListLoading
} from 'containers/common_provider/create_job_state/get_job/selectors';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'antd';
import Status from 'components/Status';
import { tokenDecoded } from 'utils/authHelper';
import { push } from 'connected-react-router';
import { changeStatusJob, cleanChangeStatusJob } from 'containers/common_provider/create_job_state/change_status_job/actions';
import { makeSelectChangeStatusJobResult } from 'containers/common_provider/create_job_state/change_status_job/selectors';
import { pushNotify } from 'utils/notify';

const OpenJobList = props => {
  const { getJobs, jobLists, clientId, loading, push, changeStatusJob, changeStatusJobResult, cleanChangeStatusJob } = props;

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);
  // console.log('inforAuto>>',infoAuth)
  useEffect(() => {
    return () => cleanChangeStatusJob();
  }, []);

  useEffect(() => {
    changeStatusJobResult?.success && pushNotify({
      type: 'success',
      message: 'Change job status success!'
    })
    cleanChangeStatusJob();
  }, [changeStatusJobResult]);

  useEffect(() => {
    getJobs(infoAuth?.agency_id, {
      params: {
        paginate: false,
        recruiter_id: infoAuth?.id,
        // client_id: clientId,
      }
    });
  }, [infoAuth, changeStatusJobResult]);
  // console.log('infoAuth',infoAuth);

  const openJobs = useMemo(() => {
    // let result;
    return jobLists && jobLists.filter(jobs => jobs.status !== 6).map(jobs => jobs);
  }, [jobLists]);

  // console.log('openJob>>',jobLists);

  const closeJob = (agencyId, jobId) => {
    const payload = {
      status: 6,
      job_id: [jobId]
    }
    changeStatusJob(agencyId, payload);
  };

  const columnClosedJobs = [
    {
      title: 'person in charge',
      dataIndex: 'person_in_charge',
      key: 'person_in_charge',
      // sorter: true,
    },
    {
      title: 'client contact name',
      dataIndex: 'business_name',
      key: 'business_name',

    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Status type={status} />
    },
    {
      title: 'role',
      dataIndex: 'job_title',
      key: 'job_title',
      // sorter: true,
      width: '20%'
    },
    {
      title: 'work type',
      dataIndex: 'work_type',
      key: 'work_type',
      // sorter: true,
    },
    {
      title: 'no. of shortlisted candidates',
      dataIndex: 'candidate_count',
      key: 'candidate_count',
      // sorter: true,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record) => (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType onClick={() => closeJob(infoAuth?.agency_id, record.id)} type="closeRole" />
          </Col>
          <Col>
            <ActionType type="view" onClick={() => push(`/job-dashboard/${record.id}`)} />
          </Col>
          <Col>
            <ActionType type="pdf" />
          </Col>
        </Row>
      ),
      width: '25%',
      align: 'right',
    },
  ];

  // const handleTableChange = useCallback( async (pagination, filters, sorter) => {
  //   // console.log('>>>',sorter);
  //   // console.log(`>>>`,sorter.order === "ascend" ? -1 : 1);
  //   setSortField(sorter.order === "ascend" ? -1 : 1);
  //   setSortDirection(sorter.field);
  //   await fetchClientList(infoAuth?.agency_id, {
  //     params: {
  //       sort_field: sorter.field,
  //       sort_direction: sorter.order === "ascend" ? -1 : 1,
  //       page: current,
  //       size: pageSize,
  //     },
  //   });
  // },[]);

  // const handleChangePage = useCallback(async currentPage => {
  //   // console.log('change page>>',currentPage);
  //   setCurrent(currentPage);
  //   await fetchClientList(infoAuth?.agency_id, {
  //     params: {
  //       page: currentPage,
  //       size: pageSize,
  //       sort_field: sortField,
  //       sort_direction: sortDirection,
  //     },
  //   });
  // }, []);

  return (
    <FormInfoDetail
      title={<FormattedMessage {...messages.openJob} />}
    >
      <TableCustom
        scroll={{ y: 165, x: 1024 }}
        // onHeaderRow={handleHeaderRow}
        // onChange={handleTableChange}
        loading={loading}
        rowKey={record => record.id}
        dataSource={openJobs}
        pagination={false}
        // paginate={true}
        // paginateStyle={`paginate-custom-style`}
        // paginateOptions={{
        //   defaultCurrent: current,
        //   defaultPageSize: pageSize,
        //   total,
        //   onChange: handleChangePage,
        // }}
        columns={columnClosedJobs}
      />
    </FormInfoDetail>
  );
};

const mapStateToProps = createStructuredSelector({
  jobLists: makeSelectJobListState(),
  loading: makeSelectJobListLoading(),
  changeStatusJobResult: makeSelectChangeStatusJobResult(),
});

const mapDispatchToProps = {
  getJobs,
  push,
  changeStatusJob,
  cleanChangeStatusJob,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(OpenJobList);
