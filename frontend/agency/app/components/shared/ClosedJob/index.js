import React, { memo, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ActionType from 'components/TableCustom/ActionType';
import { makeSelectClosedJobsLoading } from 'containers/common_provider/get_closed_job/selectors';

import changeJobStatusAction from 'containers/common_provider/change_job_status/actions';
import { makeSelectChangeJobStatusLoading } from 'containers/common_provider/change_job_status/selectors';
import { Row, Col, Modal } from 'antd';
import TableCustom from 'components/TableCustom/';
import FormInfoDetail from 'components/FormInfoDetail';
import { getUserInfo } from 'services/authentication';
import Status from 'components/Status';
import messages from './messages';
import globalMessages from 'messages';
import { FormattedMessage } from 'react-intl';
import { ContentModal } from '../../modals/ContentModal'

const ClosedJob = props => {
  const {
    title,
    closedJobLoading,
    changeJobStatus,
    changeJobStatusLoading,
    dataSource,
    totals,
    handleSearch,
  } = props;

  const userInfo = getUserInfo();
  const tag = {
    id: 4,
    key: 'closed',
    text: <FormattedMessage {...messages.statusTag.closed} />,
    color: '#32363e',
  };
  const [current, setCurrent] = useState(1);
  const [pageSizes, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');

  const onSearch = useCallback(async value => {
    handleSearch(value, current, pageSizes);
  });

  const handleSetLast = () => {
    const lastPage = parseInt(totals / pageSizes) + 1;
    setCurrent(lastPage);
    props.handleGetPanigationData(pageSizes, lastPage);
  };
  const handleSetFirst = () => {
    setCurrent(1);
    props.handleGetPanigationData(pageSizes, 1);
  };

  useEffect(() => {
    if (dataSource.length == 0 && current != 1) {
      props.handleGetPanigationData(pageSizes, current - 1);
      setCurrent(current - 1);
    }
    return () => {};
  }, [dataSource]);

  useEffect(() => {
    return () => {};
  }, [dataSource]);

  const columnClosedJobs = [
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
      dataIndex: 'status',
      key: 'status',
      //width: '15%',
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
        else if (work_type === "Contract") return <span>Permanent / FTC</span>
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
              onClick={() => handConfirmReactiveJob(record)}
              type="reActivate"
            />
          </Col>
        </Row>
      ),
    },
  ];

  const handConfirmReactiveJob = record => {
    Modal.confirm({
      centered: true,
      title: false,
      icon: false,
      className: 'nem-modal-confirm',
      content: (
        <ContentModal
          title={<FormattedMessage {...messages.reactiveModalTitle} />}
          message={<FormattedMessage {...messages.reactiveModalContent} />}
        />
      ),
      okText: <FormattedMessage {...messages.reactiveModalButton} />,
      okButtonProps: { className: 'btn-lg-text'},
      onOk: function() {
        reactiveJob(record);
      },
    });
  };

  const reactiveJob = job => {
    const { agency_id } = userInfo;
    if (agency_id) {
      const params = {
        status: 1,
        job_id: [job.id],
      };
      changeJobStatus(agency_id, params);
    }
  };

  useEffect(() => {
    return () => {};
  }, []);
  const handleChangePage = useCallback(async (currentPage, pageSize) => {
    setCurrent(currentPage);
    setPageSize(pageSize);
    props.handleGetPanigationData(pageSize, currentPage);
  }, []);
  return (
    <FormInfoDetail title={title}>
      <TableCustom
        searchBox={true}
        handleSearchBox={onSearch}
        dataSource={dataSource}
        columns={columnClosedJobs}
        pagination={false}
        paginate={true}
        paginateStyle={`paginate-custom-style`}
        paginateOptions={{
          total: totals,
          current,
          onChange: handleChangePage,
        }}
        isShowJump={true}
        setCurrentCustom={() => handleSetLast()}
        setCurrentFirst={() => handleSetFirst()}
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
    changeJobStatus: (agencyId, params) =>
      dispatch(changeJobStatusAction(agencyId, params)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ClosedJob);
