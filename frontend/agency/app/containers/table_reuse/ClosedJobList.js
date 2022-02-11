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
import { makeSelectChangeStatusJobResult } from 'containers/common_provider/create_job_state/change_status_job/selectors';
import { changeStatusJob, cleanChangeStatusJob } from 'containers/common_provider/create_job_state/change_status_job/actions';
import { pushNotify } from 'utils/notify';

const ClosedJobList = props => {
  const { getJobs, jobLists, clientId, loading, changeJobStatusResult, changeStatusJob, cleanChangeStatusJob, } = props;

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  // console.log('infoAuth>>',infoAuth);

  useEffect(() => {
    return () => cleanChangeStatusJob();
  }, []);

  // useEffect(() => {
  //   changeJobStatusResult?.success && pushNotify({
  //     type: 'open',
  //     message: 'Change job status success!'
  //   })
  // },[changeJobStatusResult]);

  useEffect(() => {
    getJobs(infoAuth?.agency_id, {
      params: {
        paginate: false,
        recruiter_id: infoAuth?.id,
      }
    });
  }, [infoAuth, changeJobStatusResult]);


  const openJobs = useMemo(() => {
    // let result;
    return jobLists && jobLists.filter(jobs => jobs.status === 6).map(jobs => jobs);
  }, [jobLists]);

  // console.log('openJob>>',openJobs);
  const reOpenJob = (agencyId, jobId) => {
    const payload = {
      status: 1,
      job_id: [jobId],
    };
    changeStatusJob(agencyId, payload);
  }

  const columnClosedJobs = [
    {
      title: 'business name',
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
      // width: '20%'
    },
    {
      title: 'work type',
      dataIndex: 'work_type',
      key: 'work_type',
      // width: '20%'
    },
    {
      title: 'no. of shortlisted candidates',
      dataIndex: 'candidate_count',
      key: 'candidate_count',
      // sorter: true,
    },
    {
      title: infoAuth?.role === 'agency' && 'Actions',
      key: infoAuth?.role === 'agency' && 'action',
      render: (record) => infoAuth?.role === 'agency' && (
        <Row justify="end" gutter={[16, 0]}>
          <Col>
            <ActionType onClick={() => reOpenJob(infoAuth?.agency_id, record.id)} type="reActivate" />
          </Col>
        </Row>
      ),
      width: infoAuth?.role === 'agency' && '25%',
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
      title={<FormattedMessage {...messages.closeJob} />}
    >
      <TableCustom
        scroll={{ y: 165, x: 1024 }}
        // onHeaderRow={handleHeaderRow}
        // onChange={handleTableChange}
        loading={loading}
        rowKey={record => record.id}
        dataSource={openJobs}
        pagination={true}
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
  changeJobStatusResult: makeSelectChangeStatusJobResult(),
});

const mapDispatchToProps = {
  getJobs,
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
)(ClosedJobList);
