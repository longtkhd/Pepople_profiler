/**
 *
 * Job_List_Exclude_Candidate_Table
 *
 */

import React, { memo, useMemo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';

import reducer from './reducer';

import TableCustom from 'components/TableCustom';
import { makeSelectCandidateIdReportPage } from 'containers/candidate_report_page/selectors';
import { getCandidateDetail } from 'containers/common_provider/candidate_state/get_candidate_detail/actions';
import { makeSelectCandidateDetailResult } from 'containers/common_provider/candidate_state/get_candidate_detail/selectors';
import { getJobList } from './actions';
import { makeSelectJobList } from './selectors';

// import './styles.less';

export function Job_List_Exclude_Candidate_Table(props) {
  useInjectReducer({ key: 'job_List', reducer });

  const {
    getJobList,
    clientData,
    // total,
    job_List,
    loading,
    // status,
    candidateId,
    candidateDetailState,
    getListSelected,
  } = props;

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [listKeySelected, setListKeySelected] = useState([]);

  const columnClosedJobs = [
    {
      title: 'business name',
      dataIndex: 'business_name',
      key: 'business_name',
    },
    {
      title: 'role',
      dataIndex: 'job_title',
      key: 'job_title',
    },
    {
      title: 'work type',
      dataIndex: 'work_type',
      key: 'work_type',
    },
  ];

  const handleChangePage = useCallback(async currentPage => {
    setCurrent(currentPage);
    await getJobList(candidateDetailState?.agency_id, {
      params: {
        page: currentPage,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
        exclude_candidate_id: candidateDetailState.id,
        status: 1,
      },
    });
  }, []);

  const rowSelection =  {
    onChange: (selectedRowKeys, selectedRows) => {
      // setListKeySelected(selectedRowKeys);
      getListSelected(selectedRowKeys);
    },
   
  };
  getListSelected(listKeySelected);

  useEffect(() => {
    getCandidateDetail(candidateId);
  }, [candidateId]);

  useEffect(() => {
    getJobList(candidateDetailState?.agency_id, {
      params: {
        page: current,
        size: pageSize,
        sort_field: sortField,
        sort_direction: sortDirection,
        exclude_candidate_id: candidateDetailState?.id,
        status: 1,
      },
    });
  }, [candidateDetailState]);


  const total = job_List.total;

  return (
    <>
      {/* <SpinnerLoading loading={true} /> */}
      <TableCustom
        scroll={{
          x: 1024,
        }}
        // loading={loading}
        rowSelection={rowSelection}
        rowKey={record => record.id}
        dataSource={job_List?.job_list}
        pagination={false}
        paginate={true}
        paginateStyle={`paginate-custom-style`}
        paginateOptions={{
          defaultCurrent: current,
          defaultPageSize: pageSize,
          total,
          onChange: handleChangePage,
        }}
        columns={columnClosedJobs}
      />
    </>
  );
}

Job_List_Exclude_Candidate_Table.propTypes = {};

const mapStateToProps = createStructuredSelector({
  candidateId: makeSelectCandidateIdReportPage(),
  candidateDetailState: makeSelectCandidateDetailResult(),
  job_List: makeSelectJobList(),
});

const mapDispatchToProps = {
  getJobList,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Job_List_Exclude_Candidate_Table);
