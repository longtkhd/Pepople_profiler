/**
 *
 * RecruiterJob
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectError } from './selectors';
import reducer from './reducer';
import loadOpenJobs from 'containers/common_provider/get_open_job/actions';
import loadClosedJobs from 'containers/common_provider/get_closed_job/actions';
import getRecruiterDetails from 'containers/common_provider/get_recruiter_details/actions';
import { makeSelectRecruiterDetails } from 'containers/common_provider/get_recruiter_details/selectors';
import { makeSelectOpenJobsResponse } from 'containers/common_provider/get_open_job/selectors';
import { makeSelectClosedJobsResponse } from 'containers/common_provider/get_closed_job/selectors';
import { makeSelectChangeJobStatusError, makeSelectChangeJobStatusResponse } from 'containers/common_provider/change_job_status/selectors';
import { getUserInfo } from 'services/authentication';

import HighlightText from 'components/atoms/HighlightText';
import MainLayout from 'components/layout/MainLayout';
import ButtonBack from 'components/ButtonBack';
import OpenJob from 'components/shared/OpenJob';
import ClosedJob from 'components/shared/ClosedJob';
import { openNotification } from 'utils/notification';
import './styles.less';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

export function RecruiterJob(props) {
  useInjectReducer({ key: 'recruiterJob', reducer });

  const {
    match,
    history,
    error,
    getOpenJobs,
    getClosedJobs,
    getRecruiterDetail,
    recruiterDetails,
    openJobResponse,
    closedJobResponse,
    changeJobStatusError,
    changeJobStatusResponse,
  } = props;

  const [openJobs, setOpenJobs] = useState([]);
  const [closedJobs, setClosedJobs] = useState([]);

  const { recruiterId } = match.params;
  const userInfo = getUserInfo();

  const [totalOpenJob, setTotalOpenJob] = useState(null);
  const [totalClosedJob, setTotalClosedJob] = useState(null);

  const [openJobPage, setOpenJobPage] = useState(1)
  const [openJobsize, setOpenJobSize] = useState(10)
  const [closedJobPage, setClosedJobPage] = useState(1)
  const [closedJobsize, setClosedJobSize] = useState(10)

  const handleGetOpenJob = (PageSize, currenPage) => {
    const { agency_id } = userInfo;
    const params = {
      recruiter_id: recruiterId,
      status: [1, 2, 3, 4],
      page: currenPage || openJobPage,
      size: PageSize || openJobsize
    }
    getOpenJobs(agency_id, params);
    if (currenPage)
      setOpenJobPage(currenPage);
    if (PageSize)
      setOpenJobSize(PageSize);
  }

  const handleGetClosedJob = (PageSize, currenPage) => {
    const { agency_id } = userInfo;
    const params = {
      recruiter_id: recruiterId,
      status: [6],
      page: currenPage || closedJobPage,
      size: PageSize || closedJobsize
    }
    getClosedJobs(agency_id, params);
    if (currenPage)
      setClosedJobPage(currenPage);
    if (PageSize)
      setClosedJobSize(PageSize);
  }

  useEffect(() => {
    if (error) {
      openNotification('error', error.message);
    }
    return () => { }
  }, [error])

  useEffect(() => {
    if (openJobResponse?.success) {
      const total = openJobResponse?.data?.total || null
      if (total) {
        // console.log(total)
        setTotalOpenJob(total);
      }
      const jobList = openJobResponse.data?.job_list || [];
      setOpenJobs(jobList.map(job => {
        job.key = job.id;
        return job;
      }));
    }
    return () => { }
  }, [openJobResponse])

  useEffect(() => {
    if (closedJobResponse?.success) {
      const total = closedJobResponse?.data?.total || null
      if (total) {
        // console.log(total)
        setTotalClosedJob(total);
      }
      const jobList = closedJobResponse.data?.job_list || [];
      setClosedJobs(jobList.map(job => {
        job.key = job.id;
        return job;
      }));
    }
    return () => { }
  }, [closedJobResponse])

  useEffect(() => {
    if (changeJobStatusResponse?.success) {
      openNotification('success', <FormattedMessage  {...messages.changeJobStatusSuccess} />);
      handleGetOpenJob();
      handleGetClosedJob();
    }
    return () => { }
  }, [changeJobStatusResponse])

  useEffect(() => {
    getRecruiterDetail(recruiterId);
    handleGetOpenJob();
    handleGetClosedJob();
    return () => { }
  }, [])

  return (
    <div>
      <Helmet>
        <title>Recruiter's Job</title>
        <meta name="description" content="Agency view the recruiter's job" />
      </Helmet>
      <MainLayout>
        <div className="recruiter-job-button-back">
          <ButtonBack history={history} />
        </div>
        <div className="recruiter-info component-bg mb-50">
          <div className="recruiter-name">
            <HighlightText>{`${recruiterDetails?.first_name} ${recruiterDetails?.last_name}`}</HighlightText>
          </div>
        </div>
        <div className="mb-50">
          <OpenJob history={history} editable={openJobs.length > 0} dataSource={openJobs} totals={totalOpenJob} handleGetPanigationData={(a, b) => handleGetOpenJob(a, b)} onAssignRecruiterSuccess={handleGetOpenJob} title={<FormattedMessage  {...messages.openJob} />} />
        </div>
        <div className="mb-50">
          <ClosedJob history={history} editable={false} totals={totalClosedJob} dataSource={closedJobs} handleGetPanigationData={(a, b) => handleGetClosedJob(a, b)} title={<FormattedMessage  {...messages.closedJob} />} />
        </div>
      </MainLayout>
    </div>
  );
}

RecruiterJob.propTypes = {
  error: PropTypes.object,
  recruiterDetails: PropTypes.object,
  openJobResponse: PropTypes.object,
  closedJobResponse: PropTypes.object,
  changeJobStatusError: PropTypes.object,
  changeJobStatusResponse: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  recruiterDetails: makeSelectRecruiterDetails(),
  openJobResponse: makeSelectOpenJobsResponse(),
  closedJobResponse: makeSelectClosedJobsResponse(),
  changeJobStatusError: makeSelectChangeJobStatusError(),
  changeJobStatusResponse: makeSelectChangeJobStatusResponse(),
});

function mapDispatchToProps(dispatch) {
  return {
    getOpenJobs: (agencyId, params) => dispatch(loadOpenJobs({ agencyId, params })),
    getClosedJobs: (agencyId, params) => dispatch(loadClosedJobs({ agencyId, params })),
    getRecruiterDetail: (recruiterId) => dispatch(getRecruiterDetails(recruiterId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(RecruiterJob);
