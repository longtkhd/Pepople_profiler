import React, { memo, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import FormInfoDetail from 'components/FormInfoDetail';
import TableCustom from 'components/TableCustom';
import ActionType from 'components/TableCustom/ActionType';
import { getJobs } from 'containers/common_provider/create_job_state/get_job/actions';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectGetJobList,
  makeSelectJobListLoad
} from './selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Col } from 'antd';
import Status from 'components/Status';
import { tokenDecoded } from 'utils/authHelper';

const ClosedJobList = props => {
  const { getJobs, jobLists, clientId, loading } = props;

  const infoAuth = useMemo(() => {
    return tokenDecoded('token') ? tokenDecoded('token') : null;
  }, [tokenDecoded]);

  useEffect(() => {
    getJobs(infoAuth?.agency_id,{
      params: {
        client_id: clientId
      }
    });
  },[infoAuth]);

  const closedJobs = useMemo(() => {
    // let result;
    return jobLists && jobLists.filter( jobs => jobs.status === 5).map( jobs => jobs );
  },[ jobLists, loading ]);

  const columnClosedJobs = [
    {
      title: 'person in charge',
      dataIndex: 'person_in_charge',
      key: 'person_in_charge',
      sorter: true,
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
    // {
    //   title: 'role',
    //   dataIndex: 'role',
    //   key: 'role',
    //   sorter: true,
    //   width: '20%'
    // },
    {
      title: 'no. of shortlisted candidates',
      dataIndex: 'candidate_count',
      key: 'candidate_count',
      sorter: true,
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
      title={<FormattedMessage {...messages.closedJob} />}
    >
      <TableCustom
        scroll={{ y: 165, x: 1024 }}
        // onHeaderRow={handleHeaderRow}
        // onChange={handleTableChange}
        loading={loading}
        rowKey={record => record.id}
        dataSource={closedJobs}
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
  jobLists: makeSelectGetJobList(),
  loading: makeSelectJobListLoad(),
});

const mapDispatchToProps = {
  getJobs,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClosedJobList);
