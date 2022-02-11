import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import reducer from './reducer';
import { useInjectReducer } from 'utils/injectReducer';
import TableCustom from 'components/TableCustom';

import { makeSelectCandidateDetailResult } from 'containers/common_provider/candidate_state/get_candidate_detail/selectors';
import { makeSelectCandidateIdPage } from 'containers/candidate_report_page/selectors';
import {
  makeSelectGetJobListData,
  makeSelectGetJobListLoading,
} from './selectors';
import makeSelectGetJobList from './selectors';
import { getJobListExcludeCandidateId } from './actions';
import { getCandidateDetail } from 'containers/common_provider/candidate_state/get_candidate_detail/actions';
import {
  makeSelectKeyAdd,
  makeSelectVisibleModal,
} from 'containers/common_provider/candidate_state/add_candidate_to_job/selectors';
import './styles.less';

const AddCandidateIntoJobTable = props => {
  useInjectReducer({ key: 'getJobListPage', reducer });
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [listIdSelectedRow, setListIdSelectedRow] = useState([]);
  const {
    getCandidateId,
    getCandidateDetail,
    match,
    candidateDetaiResult,
    candidate_Id,
    getJobListExcludeCandidateId,
    job_List,
    loading,
    keyStatus,
    visible,
    getValueSelectedRow,
    modalKey,
    keyAdd,
    visibleModal,
  } = props;

  useEffect(() => {
    setCurrent(1);

    getJobListExcludeCandidateId(candidateDetaiResult?.agency_id, {
      params: {
        page: 1,
        size: Number(pageSize),
        sort_field: sortField,
        sort_direction: sortDirection,
        exclude_candidate_id: candidateDetaiResult?.id,
        status: 1,
      },
    });
  }, [visibleModal]);

  useEffect(() => {
    getValueSelectedRow([]);
  }, [visibleModal]);

  useEffect(() => {
    setCurrent(1);

    getJobListExcludeCandidateId(candidateDetaiResult?.agency_id, {
      params: {
        page: 1,
        size: Number(pageSize),
        sort_field: sortField,
        sort_direction: sortDirection,
        exclude_candidate_id: candidateDetaiResult?.id,
        status: 1,
      },
    });
  }, [keyAdd]);

  const handleChangePage = useCallback(async currentPage => {
    setCurrent(currentPage);
    await getJobListExcludeCandidateId(candidateDetaiResult?.agency_id, {
      params: {
        page: Number(currentPage),
        size: Number(pageSize),
        status: 1,
        sort_field: sortField,
        sort_direction: sortDirection,
        exclude_candidate_id: candidateDetaiResult?.id,
      },
    });
  }, []);

  const columnClosedJobs = [
    {
      title: 'business name',
      dataIndex: 'business_name',
      key: 'business_name',
      width: '30%',
      className: 'title-bussiness-name-bold',
    },
    {
      title: 'role',
      dataIndex: 'job_title',
      key: 'job_title',
      width: '30%',
    },

    {
      title: 'work type',
      dataIndex: 'work_type',
      key: 'work_type',
      align: 'left',
    },
  ];

  const total = job_List?.total || 0;

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      getValueSelectedRow(selectedRowKeys);
    },
  };

  return (
    <>
      {visibleModal ? (
        <TableCustom
          scroll={{
            x: 1024,
            y: 300,
          }}
          rowSelection={rowSelection}
          key={keyAdd}
          loading={loading}
          className={`table_job_exclude_candidate`}
          rowKey={record => record.id}
          dataSource={job_List?.job_list}
          pagination={false}
          paginate={true}
          paginateStyle={
            job_List?.job_list && job_List.job_list?.length !== 0
              ? `paginate-custom-style`
              : `paginate-custom-style-hidden`
          }
          paginateOptions={{
            current,
            defaultPageSize: Number(pageSize),
            total,
            onChange: handleChangePage,
          }}
          columns={columnClosedJobs}
        />
      ) : null}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  getJobListPage: makeSelectGetJobList(),
  candidateDetaiResult: makeSelectCandidateDetailResult(),
  candidate_Id: makeSelectCandidateIdPage(),
  job_List: makeSelectGetJobListData(),
  loading: makeSelectGetJobListLoading(),
  keyAdd: makeSelectKeyAdd(),
  visibleModal: makeSelectVisibleModal(),
});

const mapDispatchToProps = {
  getCandidateDetail,
  getJobListExcludeCandidateId,
};
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AddCandidateIntoJobTable);
