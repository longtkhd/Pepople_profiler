/**
 *
 * JobList
 *
 */

import React, { memo, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectJobList from './selectors';
import reducer from './reducer';
import messages from './messages';

import loadOpenJobs from 'containers/common_provider/get_open_job/actions';
import loadClosedJobs from 'containers/common_provider/get_closed_job/actions';
import { makeSelectOpenJobsResponse } from 'containers/common_provider/get_open_job/selectors';
import { makeSelectClosedJobsResponse } from 'containers/common_provider/get_closed_job/selectors';
import {
  makeSelectChangeJobStatusError,
  makeSelectChangeJobStatusResponse,
} from 'containers/common_provider/change_job_status/selectors';

import CreateNewJob from 'containers/create_new_job';
import MainLayout from 'components/layout/MainLayout';
import OpenJob from 'components/shared/OpenJob';
import ClosedJob from 'components/shared/ClosedJob';

import { getUserInfo } from 'services/authentication';
import { openNotification } from 'utils/notification';
import './styles.less';
export function JobList(props) {
  useInjectReducer({ key: 'jobList', reducer });
  const {
    history,
    openJobResponse,
    closedJobResponse,
    changeJobStatusError,
    getOpenJobs,
    getClosedJobs,
    changeJobStatusResponse,
  } = props;
  const [totalOpenJob, setTotalOpenJob] = useState(null);
  const [totalClosedJob, setTotalClosedJob] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);
  const [openJobPage, setOpenJobPage] = useState(1);
  const [openJobsize, setOpenJobSize] = useState(10);
  const [closedJobPage, setClosedJobPage] = useState(1);
  const [closedJobsize, setClosedJobSize] = useState(10);
  const userInfo = getUserInfo();

  const handleGetOpenJob = (PageSize, currenPage) => {
    const { agency_id } = userInfo;
    const params = {
      recruiter_id: userInfo.id,
      status: [1, 2, 3, 4],
      page: currenPage || openJobPage,
      size: PageSize || openJobsize,
    };
    getOpenJobs(agency_id, params);
    if (currenPage) setOpenJobPage(currenPage);
    if (PageSize) setOpenJobSize(PageSize);
  };

  const handleGetClosedJob = (PageSize, currenPage) => {
    const { agency_id } = userInfo;
    const params = {
      recruiter_id: userInfo.id,
      status: [6],
      page: currenPage || closedJobPage,
      size: PageSize || closedJobsize,
    };
    getClosedJobs(agency_id, params);
    if (currenPage) setClosedJobPage(currenPage);
    if (PageSize) setClosedJobSize(PageSize);
  };

  const handleSearchOpenJob = (keyword, current, pageSizes) => {
    const { agency_id } = userInfo;
    const params = {
      recruiter_id: userInfo.id,
      status: [1, 2, 3, 4],
      page: current || openJobPage,
      size: pageSizes || openJobsize,
      keyword: keyword,
    };
    getOpenJobs(agency_id, params);
    if (current) setOpenJobPage(current);
    if (pageSizes) setOpenJobSize(pageSizes);
  };

  const handleSearchCloseJob = (keyword, current, pageSizes) => {
    const { agency_id } = userInfo;
    const params = {
      recruiter_id: userInfo.id,
      status: [6],
      page: current || closedJobPage,
      size: pageSizes || closedJobsize,
      keyword: keyword,
    };
    getClosedJobs(agency_id, params);
    if (current) setClosedJobPage(current);
    if (pageSizes) setClosedJobSize(pageSizes);
  };

  useEffect(() => {
    if (openJobResponse?.success) {
      const total = openJobResponse?.data?.total || null;
      if (total) {
        setTotalOpenJob(total);
      }
      const jobList = openJobResponse.data?.job_list || [];
      setOpenJobs(
        jobList.map(job => {
          job.key = job.id;
          return job;
        }),
      );
    }
    return () => {};
  }, [openJobResponse]);

  useEffect(() => {
    if (closedJobResponse?.success) {
      const total = closedJobResponse?.data?.total || null;
      if (total) {
        setTotalClosedJob(total);
      }
      const jobList = closedJobResponse.data?.job_list || [];
      setClosedJobs(
        jobList.map(job => {
          job.key = job.id;
          return job;
        }),
      );
    }
    return () => {};
  }, [closedJobResponse]);

  useEffect(() => {
    if (changeJobStatusResponse?.success) {
      openNotification(
        'success',
        <FormattedMessage {...messages.changeJobStatusSuccess} />,
      );
      handleGetOpenJob();
      handleGetClosedJob();
    }
    return () => {};
  }, [changeJobStatusResponse]);

  useEffect(() => {
    handleGetOpenJob();
    handleGetClosedJob();
  }, []);

  return (
    <>
      <Helmet>
        <title>Job List</title>
        <meta name="description" content="Description of JobList" />
      </Helmet>
      <MainLayout>
        <div className="mb-50">
          <CreateNewJob
            heading={<FormattedMessage {...messages.createNew} />}
          />
        </div>
        <div className="mb-50">
          <OpenJob
            history={history}
            editable={userInfo?.role === 'agency'}
            onAssignRecruiterSuccess={handleGetOpenJob}
            dataSource={openJobs}
            totals={totalOpenJob}
            handleGetPanigationData={(a, b) => handleGetOpenJob(a, b)}
            title={<FormattedMessage {...messages.openJob} />}
            handleSearch={(keyword, current, pageSizes) =>
              handleSearchOpenJob(keyword, current, pageSizes)
            }
          />
        </div>
        <div className="mb-50">
          <ClosedJob
            history={history}
            editable={false}
            dataSource={closedJobs}
            totals={totalClosedJob}
            handleGetPanigationData={(a, b) => handleGetClosedJob(a, b)}
            title={<FormattedMessage {...messages.closedJob} />}
            handleSearch={(keyword, current, pageSizes) =>
              handleSearchCloseJob(keyword, current, pageSizes)
            }
          />
        </div>
      </MainLayout>
    </>
  );
}

JobList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  openJobResponse: PropTypes.object,
  closedJobResponse: PropTypes.object,
  changeJobStatusError: PropTypes.object,
  changeJobStatusResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  jobList: makeSelectJobList(),
  openJobResponse: makeSelectOpenJobsResponse(),
  closedJobResponse: makeSelectClosedJobsResponse(),
  changeJobStatusError: makeSelectChangeJobStatusError(),
  changeJobStatusResponse: makeSelectChangeJobStatusResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getOpenJobs: (agencyId, params) =>
      dispatch(loadOpenJobs({ agencyId, params })),
    getClosedJobs: (agencyId, params) =>
      dispatch(loadClosedJobs({ agencyId, params })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(JobList);
